import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'bun:test'

const source = readFileSync(fileURLToPath(new URL('./index.tsx', import.meta.url)), 'utf8')

describe('TrailerDialog', () => {
  it('uses CSS for the iframe border instead of the deprecated frameBorder attribute', () => {
    expect(source).not.toContain('frameBorder=')
    expect(source).toMatch(/class="[^"]*\bborder-0\b[^"]*"/)
  })

  it('loads the user-requested trailer as soon as the dialog opens', () => {
    expect(source).toMatch(/allowfullscreen\s+loading="eager"/)
  })
})
