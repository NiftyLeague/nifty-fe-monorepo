import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync('package.json', 'utf8')) as {
  scripts?: Record<string, string>
}

describe('test runner policy', () => {
  it('keeps the root test entrypoint isolated per test file', () => {
    expect(manifest.scripts?.test).toBe('bun test --isolate')
    expect(manifest.scripts?.['test:coverage']).toContain('bun test --isolate')
  })
})
