import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
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

describe('response header single source', () => {
  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000',
  }
  const read = (path: string) =>
    readFileSync(join(process.cwd(), path), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')

  it('keeps the app response headers in vercel.json and nowhere else', () => {
    // On this Build Output API deploy Vercel applies vercel.json `headers`: live
    // `/assets/*` responses carry the vercel.json-only Access-Control-Allow-Origin,
    // which the Nitro output never emitted (#1904). Its duplicate of the four
    // security headers was the second source that could drift.
    const viteConfig = read('apps/app/vite.config.ts')
    for (const key of Object.keys(securityHeaders)) expect(viteConfig).not.toContain(key)

    const config = JSON.parse(read('apps/app/vercel.json')) as {
      headers?: { source: string; headers: { key: string; value: string }[] }[]
    }
    const applied = Object.fromEntries(
      (config.headers ?? [])
        .find((block) => block.source === '/(.*)')
        ?.headers.map(({ key, value }) => [key, value]) ?? []
    )
    expect(applied).toEqual(securityHeaders)
  })

  it('keeps the web response headers in vercel.json and nowhere else', () => {
    // web is static on Vercel, which never consumes the Cloudflare-style headers
    // file — the deployed copy was served verbatim as a plain asset at /_headers
    // while duplicating vercel.json (#1904) — so its generation is gone.
    expect(read('apps/web/scripts/finalize-static.mjs')).not.toContain('_headers')

    const config = JSON.parse(read('apps/web/vercel.json')) as {
      headers?: { source: string; headers: { key: string; value: string }[] }[]
    }
    const applied = Object.fromEntries(
      (config.headers ?? [])
        .find((block) => block.source === '/(.*)')
        ?.headers.map(({ key, value }) => [key, value]) ?? []
    )
    expect(applied).toEqual(securityHeaders)
  })
})
