import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Cloudflare build policy contract: every app declares the same Worker
 * identity rules and deploy surface, and the retired platform config stays
 * retired. The preview/production workflows (draft-protected, matrix over the
 * same five apps) are the deployment surface; the per-app GitHub environments
 * carry the build-time variables.
 */

const projectRoots = ['apps/app', 'apps/smashers', 'apps/api', 'apps/docs', 'apps/web']
const ACCOUNT_ID = '90526f277153982742d51be614fb9b40'
const SERVICE_NAMES: Record<string, string> = {
  'apps/app': 'nifty-league-app',
  'apps/smashers': 'nifty-league-smashers',
  'apps/api': 'nifty-league-api',
  'apps/docs': 'nifty-league-docs',
  'apps/web': 'nifty-league-web-astro',
}

const readWrangler = (projectRoot: string) => {
  const raw = readFileSync(join(process.cwd(), projectRoot, 'wrangler.jsonc'), 'utf8')
  // wrangler.jsonc allows comments and trailing commas; normalize both before
  // parsing (mirrors how wrangler's own parser reads the file).
  const stripped = raw
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .filter((line) => !line.trim().startsWith('//'))
    .join('\n')
    .replace(/,([\s\n]*[}\]])/g, '$1')
  return JSON.parse(stripped) as {
    name?: string
    account_id?: string
    main?: string
    compatibility_date?: string
    compatibility_flags?: string[]
    workers_dev?: boolean
    observability?: { enabled?: boolean }
    alias?: Record<string, string>
    assets?: { directory?: string; binding?: string }
  }
}

describe('Cloudflare build policy', () => {
  it('keeps every app on the shared Worker identity policy', () => {
    for (const projectRoot of projectRoots) {
      const config = readWrangler(projectRoot)
      expect(config.name, projectRoot).toBe(SERVICE_NAMES[projectRoot])
      expect(config.account_id, projectRoot).toBe(ACCOUNT_ID)
      expect(config.workers_dev ?? false, projectRoot).toBe(true)
      expect(config.observability?.enabled ?? false, projectRoot).toBe(true)
    }
  })

  it('keeps the Workers compatibility surface current', () => {
    // app pins the date its LOCAL dev sandbox supports (miniflare 4.x runtime);
    // every other app tracks the current release date.
    const expectedDate: Record<string, string> = {
      'apps/app': '2026-08-06',
    }
    for (const projectRoot of projectRoots) {
      const config = readWrangler(projectRoot)
      expect(config.compatibility_date ?? '', `${projectRoot} compatibility_date`).toBe(
        expectedDate[projectRoot] ?? '2026-09-09'
      )
    }
    for (const projectRoot of ['apps/app', 'apps/smashers', 'apps/api']) {
      const config = readWrangler(projectRoot)
      expect(config.compatibility_flags, projectRoot).toContain('nodejs_compat')
      expect(config.compatibility_flags, projectRoot).toContain(
        'nodejs_compat_populate_process_env'
      )
    }
  })

  it('points the api Worker at source with the config shim aliased', () => {
    const config = readWrangler('apps/api')
    expect(config.main).toBe('src/worker.ts')
    expect(config.alias?.['node-config-ts']).toBe('./src/lib/node-config-ts-shim.ts')
  })

  it('keeps the retired platform config retired', () => {
    for (const projectRoot of projectRoots) {
      expect(existsSync(join(process.cwd(), projectRoot, 'vercel.json')), projectRoot).toBe(false)
    }
    expect(existsSync(join(process.cwd(), 'scripts', 'vercel-ignore-build.mjs'))).toBe(false)
  })

  it('gives every app a build:cloudflare entrypoint for the deploy workflow', () => {
    for (const projectRoot of projectRoots) {
      const manifest = JSON.parse(
        readFileSync(join(process.cwd(), projectRoot, 'package.json'), 'utf8') as string
      ) as { scripts?: Record<string, string> }
      expect(manifest.scripts?.['build:cloudflare'], projectRoot).toBeDefined()
    }
  })

  it('runs the app worker wrapper after the cloudflare build', () => {
    const manifest = JSON.parse(
      readFileSync(join(process.cwd(), 'apps/app/package.json'), 'utf8')
    ) as { scripts?: Record<string, string> }
    expect(manifest.scripts?.['build:cloudflare']).toContain('post-build-worker.mjs')
    // The nitro preset defaults to the Workers target; the E2E suite still
    // overrides it with node-server.
    const viteConfig = readFileSync(join(process.cwd(), 'apps/app/vite.config.ts'), 'utf8')
    expect(viteConfig).toContain('cloudflare_module')
  })
})

describe('response header sources', () => {
  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  }

  it('keeps the app response headers in the app header module and nowhere else', () => {
    const viteConfig = readFileSync(join(process.cwd(), 'apps/app/vite.config.ts'), 'utf8')
    for (const key of Object.keys(securityHeaders)) expect(viteConfig).not.toContain(key)

    const headersModule = readFileSync(
      join(process.cwd(), 'apps/app/scripts/headers-content.mjs'),
      'utf8'
    )
    for (const [key, value] of Object.entries(securityHeaders)) {
      expect(headersModule).toContain(`${key}: ${value}`)
    }
    expect(headersModule).toContain('Access-Control-Allow-Origin: *')
  })

  it('keeps the web header policy in its single source module', () => {
    // web serves production from the Workers assets surface; the `_headers`
    // file written from this module is the only header source.
    const module = readFileSync(join(process.cwd(), 'apps/web/scripts/static-headers.mjs'), 'utf8')
    for (const [key, value] of Object.entries(securityHeaders)) {
      expect(module).toContain(`${key}: ${value}`)
    }
    expect(module).toContain('Access-Control-Allow-Origin: *')
  })

  it('keeps the api security headers in the worker entry', () => {
    const worker = readFileSync(join(process.cwd(), 'apps/api/src/worker.ts'), 'utf8')
    for (const value of Object.values(securityHeaders)) {
      expect(worker).toContain(`'${value}'`)
    }
  })
})

/** Reads a repo file relative to the project root. */
const readRepoFile = (path: string) => readFileSync(join(process.cwd(), path), 'utf8')

describe('worker runtime environment contract', () => {
  // The Workers runtime exposes deployed vars/secrets to server code through
  // process.env, which Astro/vite does NOT bake — a runtime read of a key that
  // has no binding silently returns undefined and the route degrades (the
  // store deep links 404'd exactly like this after the cutover). These checks
  // pin every runtime-read key to its committed binding.

  it('binds every runtime-read smashers PUBLIC_* key in the wrangler config', () => {
    // store-links.ts resolves its keys through a defaulted process.env param,
    // so scan for both direct reads and the known key list.
    const sourceFiles = ['apps/smashers/src/runtime/store-links.ts']
    const directReads = new Set<string>()
    for (const file of sourceFiles) {
      // store-links.ts reads through a defaulted env param, so match the key
      // wherever it is dereferenced, not only on process.env.
      for (const match of readRepoFile(file).matchAll(/\b(PUBLIC_[A-Z0-9_]+)\b/g)) {
        directReads.add(match[1] as string)
      }
    }

    const config = readRepoFile('apps/smashers/astro.wrangler.jsonc')
    for (const key of directReads) {
      expect(config.includes(`"${key}"`), `${key} must be a wrangler var`).toBe(true)
    }

    // The five storefront keys are the contract: a rename here without the
    // matching var (and Worker binding) brings the deep-link 404s back.
    for (const key of [
      'PUBLIC_APPLE_STORE_ID',
      'PUBLIC_APPLE_STORE_LINK',
      'PUBLIC_GOOGLE_PLAY_LINK',
      'PUBLIC_EPIC_LINK',
      'PUBLIC_STEAM_LINK',
    ]) {
      expect(directReads.has(key), `${key} disappeared from store-links.ts`).toBe(true)
      expect(config.includes(`"${key}"`)).toBe(true)
    }
  })

  it('documents the smashers secrets that must exist outside the repo', () => {
    // Not verifiable from files (Worker secrets are account state), but the
    // required set stays pinned here so additions/rotations have a checklist:
    // SESSION_SECRET (32+ chars), PLAYFAB_API_KEY, PUBLIC_DEPLOY_ENV=production
    // (gates the session cookie Secure flag and the server Sentry gate), and
    // the four OAuth *_CLIENT_ID / *_CLIENT_SECRET pairs.
    const session = readRepoFile('apps/smashers/src/utils/session.ts')
    expect(session).toContain('process.env.SESSION_SECRET')
    expect(session).toContain("process.env.PUBLIC_DEPLOY_ENV === 'production'")
  })

  it('resolves every api config placeholder from a pinned Worker secret', () => {
    // config/default.json @@NAME placeholders are resolved by the
    // node-config-ts shim from Worker bindings; a placeholder without a
    // deployed secret silently resolves to '' (this is how production lost
    // its Etherscan key once).
    const configJson = readRepoFile('apps/api/config/default.json')
    const placeholders = new Set(
      [...configJson.matchAll(/"@@([A-Z0-9_]+)"/g)].map((m) => m[1] as string)
    )
    const workerSecrets = readRepoFile('test/contract/cloudflare-worker-secrets.json')
    const pinned = new Set(JSON.parse(workerSecrets) as string[])

    expect(pinned.size).toBeGreaterThan(20)
    for (const name of placeholders) {
      expect(pinned.has(name), `api config @@${name} has no pinned Worker secret`).toBe(true)
    }
  })
})
