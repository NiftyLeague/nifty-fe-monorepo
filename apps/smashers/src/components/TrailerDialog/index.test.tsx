import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'bun:test'

const source = readFileSync(fileURLToPath(new URL('./index.tsx', import.meta.url)), 'utf8')

describe('TrailerDialog', () => {
  it('uses CSS for the iframe border instead of the deprecated frameBorder attribute', () => {
    expect(source).not.toContain('frameBorder=')
    expect(source).toMatch(/className="[^"]*\bborder-0\b[^"]*"/)
  })
})
