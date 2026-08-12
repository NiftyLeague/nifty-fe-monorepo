import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { shouldBuild } from '../../scripts/vercel-ignore-build.mjs'

const projectRoots = ['apps/web', 'apps/app', 'apps/smashers', 'apps/api', 'apps/docs']
const deploymentEnabled = { '**': false, main: true, staging: true }
const ignoreCommand = 'node ../../scripts/vercel-ignore-build.mjs'

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
})
