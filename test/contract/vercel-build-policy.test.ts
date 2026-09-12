import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { HEADERS_FILE } from '../../apps/web/scripts/static-headers.mjs'
import {
  canonicalProjectName,
  isProjectAffected,
  shouldBuild,
} from '../../scripts/vercel-ignore-build.mjs'

const projectRoots = ['apps/app', 'apps/smashers', 'apps/api', 'apps/docs', 'apps/web']
const deploymentEnabled = { 'codex/*': false, '**': false, main: true }
const ignoreCommand = 'node ../../scripts/vercel-ignore-build.mjs'
const installCommand = 'bunx bun@1.4.0 install --frozen-lockfile'
const consolidatedStatusPolicy = 'consolidated Git commit status disabled'

describe('Vercel build cost policy', () => {
  for (const projectRoot of projectRoots) {
    it(`limits ${projectRoot} automatic deployments to release branches`, () => {
      const configPath = join(process.cwd(), projectRoot, 'vercel.json')
      const config = JSON.parse(readFileSync(configPath, 'utf8')) as {
        git?: { deploymentEnabled?: Record<string, boolean> }
        installCommand?: string
        ignoreCommand?: string
      }

      expect(config.git?.deploymentEnabled).toEqual(deploymentEnabled)
      expect(config.ignoreCommand).toBe(ignoreCommand)
      expect(config.installCommand).toBe(installCommand)
    })
  }

  it('keeps every Vercel-connected app on the shared policy', () => {
    expect(projectRoots).toHaveLength(5)
  })

  it('builds the release branch and manual deployments only', () => {
    expect(shouldBuild('main')).toBe(true)
    expect(shouldBuild('codex/perf-route')).toBe(false)
    expect(shouldBuild('feat/large-change')).toBe(false)
    expect(shouldBuild(undefined)).toBe(true)
  })

  it('no longer builds the merged Astro migration branches', () => {
    expect(shouldBuild('feat/web-astro-migration', 'web', ['apps/web/src/pages/index.astro'])).toBe(
      false
    )
    expect(
      shouldBuild('feat/smashers-astro-migration', 'smashers', [
        'apps/smashers/src/pages/index.astro',
      ])
    ).toBe(false)
    expect(shouldBuild('feat/docs-astro-starlight', 'docs', ['apps/docs/astro.config.mjs'])).toBe(
      false
    )
  })

  it('maps Vercel project aliases to their monorepo app', () => {
    expect(canonicalProjectName('smashers-web')).toBe('smashers')
    expect(canonicalProjectName('web')).toBe('web')
  })

  it('builds the web Astro project for its own and shared paths', () => {
    expect(isProjectAffected('web', ['apps/web/src/pages/index.astro'])).toBe(true)
    expect(isProjectAffected('web', ['apps/web/worker/routes.mjs'])).toBe(true)
    expect(isProjectAffected('web', ['packages/ui/src/base/button.tsx'])).toBe(true)
    expect(isProjectAffected('web', ['assets/img/hero/bg.webp'])).toBe(true)
    expect(isProjectAffected('web', ['apps/app/src/pages/page.tsx'])).toBe(false)
  })

  it('builds only projects affected by app or shared paths', () => {
    expect(isProjectAffected('app', ['apps/app/src/pages/page.tsx'])).toBe(true)
    expect(isProjectAffected('app', ['apps/smashers/src/app/page.tsx'])).toBe(false)
    expect(isProjectAffected('smashers-web', ['apps/smashers/src/app/page.tsx'])).toBe(true)
    expect(isProjectAffected('docs', ['packages/ui/src/base/button.tsx'])).toBe(true)
    expect(isProjectAffected('docs', ['packages/contracts/src/index.ts'])).toBe(false)
    expect(isProjectAffected('app', ['packages/contracts/src/index.ts'])).toBe(true)
    expect(isProjectAffected('api', ['packages/playfab/src/api.ts'])).toBe(false)
    expect(isProjectAffected('smashers', ['packages/playfab/src/api.ts'])).toBe(true)
    // The retired shared Next image config no longer maps to any project.
    expect(isProjectAffected('app', ['config/image-device-sizes.ts'])).toBe(false)
    expect(isProjectAffected('smashers', ['config/image-device-sizes.ts'])).toBe(false)
    expect(isProjectAffected('docs', ['packages/new-runtime/src/index.ts'])).toBe(true)
    expect(isProjectAffected('api', ['scripts/audit.sh'])).toBe(false)
    expect(isProjectAffected('api', ['apps/web/src/app/page.tsx'])).toBe(false)
    expect(isProjectAffected('new-project', ['README.md'])).toBe(true)
  })

  it('keeps release builds fail-open when Git history is unavailable', () => {
    expect(shouldBuild('main', 'app', undefined)).toBe(true)
    expect(shouldBuild('main', 'app', ['packages/ui/src/index.ts'])).toBe(true)
  })

  it('documents the live aggregate-status cost control outside generated policy', () => {
    const readme = readFileSync(join(process.cwd(), 'README.md'), 'utf8')

    expect(readme).toContain(consolidatedStatusPolicy)
  })
})

describe('response header sources', () => {
  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000',
  }
  const read = (path: string) =>
    readFileSync(join(process.cwd(), path), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')

  type HeaderBlock = { source: string; headers: { key: string; value: string }[] }
  const vercelHeaders = (path: string) => {
    const config = JSON.parse(read(path)) as { headers?: HeaderBlock[] }
    return Object.fromEntries(
      (config.headers ?? []).map((block) => [
        // vercel.json path-to-regexp syntax to the `_headers` wildcard syntax.
        block.source.replace('/(.*)', '/*').replace('/:path*', '/*'),
        Object.fromEntries(block.headers.map(({ key, value }) => [key, value])),
      ])
    )
  }
  const parseHeadersFile = (file: string) => {
    const entries: Record<string, Record<string, string>> = {}
    let path: string | undefined
    for (const line of file.split('\n')) {
      if (!line.trim()) continue
      if (!line.startsWith(' ')) path = line.trim()
      else {
        entries[path!] ??= {}
        const [key, value] = line.trim().split(': ')
        entries[path!][key] = value
      }
    }
    return entries
  }

  it('keeps the app response headers in vercel.json and nowhere else', () => {
    // On this Build Output API deploy Vercel applies vercel.json `headers`: live
    // `/assets/*` responses carry the vercel.json-only Access-Control-Allow-Origin,
    // which the Nitro output never emitted (#1904). Its duplicate of the four
    // security headers was the second source that could drift, so it is gone.
    const viteConfig = read('apps/app/vite.config.ts')
    for (const key of Object.keys(securityHeaders)) expect(viteConfig).not.toContain(key)

    const applied = vercelHeaders('apps/app/vercel.json')['/*']
    expect(applied).toEqual(securityHeaders)
  })

  it('keeps the two web platform header sources in sync', () => {
    // web serves production from Vercel, whose source is vercel.json, and runs the
    // Cloudflare Workers assets surface through wrangler, whose source is the
    // `_headers` file written into dist. Neither platform reads the other's
    // format, so the sync itself is the contract (#1904).
    const fileHeaders = parseHeadersFile(HEADERS_FILE)
    const vercel = vercelHeaders('apps/web/vercel.json')
    for (const [source, headers] of Object.entries(vercel)) {
      expect(fileHeaders[source]).toEqual(headers)
    }
    expect(Object.keys(fileHeaders).sort()).toEqual(Object.keys(vercel).sort())

    const applied = vercel['/*']
    expect(applied).toEqual(securityHeaders)
  })
})
