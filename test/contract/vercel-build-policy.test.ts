import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  canonicalProjectName,
  isProjectAffected,
  shouldBuild,
} from '../../scripts/vercel-ignore-build.mjs'

const projectRoots = ['apps/web', 'apps/app', 'apps/smashers', 'apps/api', 'apps/docs']
const deploymentEnabled = { 'codex/*': false, '**': false, main: true, staging: true }
const ignoreCommand = 'node ../../scripts/vercel-ignore-build.mjs'
const consolidatedStatusPolicy = 'consolidated Git commit status disabled'

describe('Vercel build cost policy', () => {
  for (const projectRoot of projectRoots) {
    it(`limits ${projectRoot} automatic deployments to release branches`, () => {
      const configPath = join(process.cwd(), projectRoot, 'vercel.json')
      const config = JSON.parse(readFileSync(configPath, 'utf8')) as {
        git?: { deploymentEnabled?: Record<string, boolean> }
        ignoreCommand?: string
      }

      expect(config.git?.deploymentEnabled).toEqual(deploymentEnabled)
      expect(config.ignoreCommand).toBe(ignoreCommand)
    })
  }

  it('keeps every Vercel-connected app on the shared policy', () => {
    expect(projectRoots).toHaveLength(5)
  })

  it('builds release branches and manual deployments only', () => {
    expect(shouldBuild('main')).toBe(true)
    expect(shouldBuild('staging')).toBe(true)
    expect(shouldBuild('codex/perf-route')).toBe(false)
    expect(shouldBuild('feat/large-change')).toBe(false)
    expect(shouldBuild(undefined)).toBe(true)
  })

  it('maps Vercel project aliases to their monorepo app', () => {
    expect(canonicalProjectName('smashers-web')).toBe('smashers')
    expect(canonicalProjectName('apps/web')).toBeNull()
  })

  it('builds only projects affected by app or shared paths', () => {
    expect(isProjectAffected('web', ['apps/web/src/app/page.tsx'])).toBe(true)
    expect(isProjectAffected('web', ['apps/app/src/app/page.tsx'])).toBe(false)
    expect(isProjectAffected('smashers-web', ['apps/smashers/src/app/page.tsx'])).toBe(true)
    expect(isProjectAffected('docs', ['packages/ui/src/base/button.tsx'])).toBe(true)
    expect(isProjectAffected('web', ['packages/contracts/src/index.ts'])).toBe(false)
    expect(isProjectAffected('docs', ['packages/contracts/src/index.ts'])).toBe(false)
    expect(isProjectAffected('app', ['packages/contracts/src/index.ts'])).toBe(true)
    expect(isProjectAffected('api', ['packages/playfab/src/api.ts'])).toBe(false)
    expect(isProjectAffected('smashers', ['packages/playfab/src/api.ts'])).toBe(true)
    expect(isProjectAffected('web', ['packages/eslint-config/next.js'])).toBe(true)
    expect(isProjectAffected('docs', ['packages/typescript-config/nextjs.json'])).toBe(true)
    expect(isProjectAffected('docs', ['packages/new-runtime/src/index.ts'])).toBe(true)
    expect(isProjectAffected('api', ['apps/web/src/app/page.tsx'])).toBe(false)
    expect(isProjectAffected('new-project', ['README.md'])).toBe(true)
  })

  it('keeps release builds fail-open when Git history is unavailable', () => {
    expect(shouldBuild('main', 'web', undefined)).toBe(true)
    expect(shouldBuild('staging', 'web', ['apps/app/src/app/page.tsx'])).toBe(false)
    expect(shouldBuild('main', 'web', ['packages/ui/src/index.ts'])).toBe(true)
  })

  it('documents the live aggregate-status cost control', () => {
    const contributionGuide = readFileSync(join(process.cwd(), '.github/CONTRIBUTING.md'), 'utf8')

    expect(contributionGuide).toContain(consolidatedStatusPolicy)
  })
})
