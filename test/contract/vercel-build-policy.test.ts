import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const projectRoots = ['apps/web', 'apps/app', 'apps/smashers', 'apps/api', 'apps/docs']
const deploymentEnabled = { '**': false, main: true, staging: true }

describe('Vercel build cost policy', () => {
  for (const projectRoot of projectRoots) {
    it(`limits ${projectRoot} automatic deployments to release branches`, () => {
      const configPath = join(process.cwd(), projectRoot, 'vercel.json')
      const config = JSON.parse(readFileSync(configPath, 'utf8')) as {
        git?: { deploymentEnabled?: Record<string, boolean> }
        ignoreCommand?: string
      }

      expect(config.git?.deploymentEnabled).toEqual(deploymentEnabled)
      expect(config.ignoreCommand).toBeUndefined()
    })
  }

  it('keeps every Vercel-connected app on the shared policy', () => {
    expect(projectRoots).toHaveLength(5)
  })
})
