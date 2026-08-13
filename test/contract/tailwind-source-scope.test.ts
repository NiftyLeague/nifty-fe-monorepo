import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'

const sharedStyles = readFileSync('packages/ui/src/styles/globals.css', 'utf8')

const appStyles = [
  'apps/app/src/styles/app.css',
  'apps/web/src/styles/app.css',
  'apps/smashers/src/styles/app.css',
  'apps/template/src/styles/app.css',
]

describe('Tailwind source scope', () => {
  it('keeps the shared shadcn stylesheet explicit and package-local', () => {
    expect(sharedStyles).toContain("@import 'tailwindcss' source(none);")
    expect(sharedStyles).toContain('@source "../**/*.{ts,tsx}";')
    expect(sharedStyles).not.toContain('@source "../../../../apps/**/*.{ts,tsx}";')
    expect(sharedStyles).not.toContain('@source "../../../playfab/**/*.{ts,tsx}";')
  })

  it('scans each consuming app and retains Smashers PlayFab classes', () => {
    for (const appStyle of appStyles) {
      const source = readFileSync(appStyle, 'utf8')
      expect(source).toContain('@source "../**/*.{ts,tsx}";')
    }

    const smashersStyles = readFileSync('apps/smashers/src/styles/app.css', 'utf8')
    expect(smashersStyles).toContain('@source "../../../../packages/playfab/src/**/*.{ts,tsx}";')
  })
})
