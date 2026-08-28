import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync('package.json', 'utf8')) as {
  packageManager?: string
  devEngines?: { packageManager?: { name?: string; version?: string } }
}
const lockfile = readFileSync('bun.lock', 'utf8')

describe('build reproducibility', () => {
  it('keeps Bun policy compatible with Vercel lockfile resolution', () => {
    expect(manifest.packageManager).toBe('bun@1.4.0')
    expect(manifest.devEngines?.packageManager).toEqual({ name: 'bun', version: '1.4.0' })
    expect(lockfile).toMatch(/"lockfileVersion": 1,/)
  })
})
