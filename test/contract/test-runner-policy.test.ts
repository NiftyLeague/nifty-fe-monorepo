import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync('package.json', 'utf8')) as {
  scripts?: Record<string, string>
}
const apiManifest = JSON.parse(readFileSync('apps/api/package.json', 'utf8')) as {
  scripts?: Record<string, string>
}

describe('test runner policy', () => {
  it('keeps the root test entrypoint isolated per test file', () => {
    expect(manifest.scripts?.test).toBe('bun test --isolate --max-concurrency=1 --timeout=15000')
    expect(manifest.scripts?.['test:coverage']).toBe(
      'bun test --isolate --coverage --max-concurrency=1 --timeout=15000'
    )
  })

  it('keeps deployment smoke checks out of default test discovery', () => {
    expect(apiManifest.scripts?.['test:live']).toContain('./test/smoke/api.contract.live.ts')
    expect(apiManifest.scripts?.['test:live']).not.toContain('RUN_LIVE_TESTS')
    expect(apiManifest.scripts?.['test:live']).not.toContain('api.contract.test.ts')
  })
})
