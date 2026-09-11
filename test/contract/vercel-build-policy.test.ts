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
// The Astro migration PR re-enables preview deployments for its own branch
// while the shared policy keeps every other feature branch off.
const webDeploymentEnabled = { ...deploymentEnabled, 'feat/web-astro-migration': true }
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

      expect(config.git?.deploymentEnabled).toEqual(
        projectRoot === 'apps/web' ? webDeploymentEnabled : deploymentEnabled
      )
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

  it('builds the migration branch preview for the web project', () => {
    expect(shouldBuild('feat/web-astro-migration', 'web', ['apps/web/src/pages/index.astro'])).toBe(
      true
    )
    expect(shouldBuild('feat/web-astro-migration', 'web', ['apps/docs/src/page.tsx'])).toBe(false)
    expect(shouldBuild('feat/web-astro-migration', 'app', ['apps/app/src/app/page.tsx'])).toBe(true)
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
    expect(isProjectAffected('web', ['apps/app/src/app/page.tsx'])).toBe(false)
  })

  it('builds only projects affected by app or shared paths', () => {
    expect(isProjectAffected('app', ['apps/app/src/app/page.tsx'])).toBe(true)
    expect(isProjectAffected('app', ['apps/smashers/src/app/page.tsx'])).toBe(false)
    expect(isProjectAffected('smashers-web', ['apps/smashers/src/app/page.tsx'])).toBe(true)
    expect(isProjectAffected('docs', ['packages/ui/src/base/button.tsx'])).toBe(true)
    expect(isProjectAffected('docs', ['packages/contracts/src/index.ts'])).toBe(false)
    expect(isProjectAffected('app', ['packages/contracts/src/index.ts'])).toBe(true)
    expect(isProjectAffected('api', ['packages/playfab/src/api.ts'])).toBe(false)
    expect(isProjectAffected('smashers', ['packages/playfab/src/api.ts'])).toBe(true)
    expect(isProjectAffected('docs', ['packages/typescript-config/nextjs.json'])).toBe(true)
    expect(isProjectAffected('app', ['config/image-device-sizes.ts'])).toBe(true)
    expect(isProjectAffected('smashers', ['config/image-device-sizes.ts'])).toBe(true)
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
