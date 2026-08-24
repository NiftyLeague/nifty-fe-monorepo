import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync('package.json', 'utf8')) as {
  packageManager?: string
  devEngines?: { packageManager?: { name?: string; version?: string } }
}

describe('build reproducibility', () => {
  it('pins Bun for hosted and local package-manager resolution', () => {
    expect(manifest.packageManager).toBe('bun@1.3.14')
    expect(manifest.devEngines?.packageManager).toEqual({ name: 'bun', version: '1.3.14' })
  })
})
