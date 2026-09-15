import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'

const sharedStyles = readFileSync('packages/ui/src/styles/globals.css', 'utf8')

const appStyles = [
  'apps/app/src/styles/app.css',
  'apps/web/src/styles/app.css',
  'apps/smashers/src/styles/app.css',
]

describe('Tailwind source scope', () => {
  it('keeps the shared shadcn stylesheet explicit and package-local', () => {
    expect(sharedStyles).toContain("@import 'tailwindcss' source(none);")
    expect(sharedStyles).toContain('@source "../**/*.{ts,tsx}";')
    expect(sharedStyles).not.toContain('@source "../../../../apps/**/*.{ts,tsx}";')
    expect(sharedStyles).not.toContain('@source "../../../playfab/**/*.{ts,tsx}";')
  })

  it('scans each consuming app and retains Smashers PlayFab classes', () => {
    // web holds its marketing utilities in src/pages/*.astro, so its scan must
    // cover .astro as well; the React-only apps keep the ts/tsx glob.
    const appGlobs: Record<string, string> = {
      'apps/app/src/styles/app.css': '@source "../**/*.{ts,tsx}";',
      'apps/web/src/styles/app.css': '@source "../**/*.{ts,tsx,astro}";',
      'apps/smashers/src/styles/app.css': '@source "../**/*.{ts,tsx}";',
    }
    for (const appStyle of appStyles) {
      const source = readFileSync(appStyle, 'utf8')
      expect(source).toContain(appGlobs[appStyle])
    }

    const smashersStyles = readFileSync('apps/smashers/src/styles/app.css', 'utf8')
    expect(smashersStyles).toContain('@source "../../../../packages/playfab/src/**/*.{ts,tsx}";')
  })
  it('does not ship animation utilities removed with the legacy client wrapper', () => {
    for (const utility of [
      'delay-lite',
      'delay-normal',
      'delay-long',
      'delay-long-offset',
      'delay-extreme',
      'delay-extreme-offset',
      'transition-fade-quick',
      'transition-fade-start',
      'transition-vertical-fade-start',
      'transition-quick-pop-start',
      'transition-quick-pop-left-start',
    ]) {
      expect(sharedStyles).not.toContain(utility)
    }
  })
})
