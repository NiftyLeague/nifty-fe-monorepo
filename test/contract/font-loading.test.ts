import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Font loading contract.
 *
 * One stylesheet owns the faces and the `--font-*` properties the Tailwind
 * theme consumes: `packages/ui/src/styles/fonts.css`. Each app imports it from
 * its own stylesheet, so a family and its metric-matched fallback are declared
 * once. The app shells keep only the island wrapper rule.
 */

const SHARED_FONT_STYLESHEET = 'packages/ui/src/styles/fonts.css'

/** Apps that render the shared Tailwind theme and therefore consume its fonts. */
const THEMED_APP_STYLESHEETS = {
  app: 'apps/app/src/styles/app.css',
  smashers: 'apps/smashers/src/styles/app.css',
  web: 'apps/web/src/styles/app.css',
}

/** The app shells that used to inline the faces. */
const APP_SHELLS = {
  smashers: 'apps/smashers/src/layouts/Base.astro',
  web: 'apps/web/src/layouts/Base.astro',
}

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8')

/** Declarations only: these contracts are about CSS, and the prose explains why. */
const declarations = (path: string) => read(path).replace(/\/\*[\s\S]*?\*\//g, '')

const FAMILIES = [
  'NL IBM Plex Sans',
  'NL Nexa Rust Sans Black',
  'NL Lilita One',
  'NL Press Start 2P',
]

/** The four names `01_tailwind.theme.css` builds its derived fonts from. */
const THEME_VARIABLES = [
  '--font-ibm-plex-sans',
  '--font-nexa-rust-sans-black',
  '--font-lilita-one',
  '--font-press-start',
]

describe('shared font loading contract', () => {
  it('declares every family once, with the variables the theme consumes', () => {
    const source = declarations(SHARED_FONT_STYLESHEET)

    for (const family of FAMILIES) {
      expect(source, `${family} must be declared`).toContain(`font-family: '${family}'`)
    }
    expect(source.match(/@font-face/g)).toHaveLength(4)

    for (const cssVar of THEME_VARIABLES) {
      expect(source, `${cssVar} is what the Tailwind theme consumes`).toContain(cssVar)
    }
    // The drift this file fixed: web declared `--font-press-start-2p`, so the
    // theme's `--special-font` chain resolved to nothing.
    expect(source).not.toContain('--font-press-start-2p')
  })

  it('keeps the metric-matched fallbacks out of the shared file', () => {
    // Their advance widths are faithful for two of the four families and not for
    // the others, so they change wrapping. Adopting them is a per-app decision
    // measured against that app's own pages; smashers is the app that has.
    const shared = declarations(SHARED_FONT_STYLESHEET)

    expect(shared).not.toContain('fallback')
    expect(shared).not.toContain('size-adjust')
    expect(shared).not.toContain('ascent-override')
  })

  it('publishes the stylesheet through the package exports map', () => {
    const exports = JSON.parse(read('packages/ui/package.json')).exports as Record<string, string>
    expect(exports['./styles/fonts.css']).toBe('./src/styles/fonts.css')
  })

  it('has every themed app import the shared stylesheet', () => {
    for (const [app, stylesheet] of Object.entries(THEMED_APP_STYLESHEETS)) {
      const source = declarations(stylesheet)
      expect(source, `${app} must import the shared fonts`).toContain(
        "@import '@nl/ui/styles/fonts.css'"
      )
      // A per-app copy of the real faces would shadow the shared ones.
      for (const family of FAMILIES) {
        expect(source, `${app} must not redeclare ${family}`).not.toContain(
          `font-family: '${family}';\n  src: url`
        )
      }
      // The app's next/font stand-in is gone; nothing resolves `@nl/ui/fonts`.
      expect(source, `${app} must not import a per-app font stylesheet`).not.toContain(
        "import './fonts.css'"
      )
    }
  })

  it('keeps the fallback layer opt-in, with smashers as the measured adopter', () => {
    const smashers = declarations('apps/smashers/src/styles/app.css')

    expect(smashers).toContain("font-family: 'NL Nexa Rust Sans Black fallback'")
    expect(smashers).toContain('size-adjust: 156.14%')
    expect(smashers).toContain("'NL Lilita One fallback'")

    // The app and web have no measured reason to carry the layer.
    for (const path of ['apps/app/src/styles/app.css', 'apps/web/src/styles/app.css']) {
      expect(declarations(path), `${path} must not declare fallback faces`).not.toContain(
        'size-adjust'
      )
    }
  })

  it('fixes the web special-face drift at the variable, not per page', () => {
    const web = declarations('apps/web/src/styles/app.css')

    // web points its subheader font at the special face; that chain now resolves
    // because the shared stylesheet declares `--font-press-start`.
    expect(web).toContain('--subheader-font: var(--special-font)')
    expect(read(SHARED_FONT_STYLESHEET)).toContain("--font-press-start: 'NL Press Start 2P'")
  })

  it('keeps the faces out of the app shells, which belong to the shell only', () => {
    for (const [app, shell] of Object.entries(APP_SHELLS)) {
      const source = read(shell)
      expect(source, `${app} shell must not declare faces`).not.toContain('@font-face')
      expect(source, `${app} shell must not declare theme font variables`).not.toContain(
        '--font-ibm-plex-sans'
      )
      // The island wrapper rule stays: `astro-island` defaults to inline.
      expect(source).toContain('astro-island{display:contents}')
    }
  })

  it('keeps the removed next/font stand-ins removed', () => {
    for (const path of ['apps/app/src/runtime/fonts.ts', 'apps/app/src/styles/fonts.css']) {
      expect(existsSync(join(process.cwd(), path)), `${path} must not come back`).toBe(false)
    }
    expect(read('apps/app/vite.config.ts')).not.toContain('@nl/ui/fonts')
    // The build-time font pipeline must not come back; the stylesheets only
    // refer to it in prose, explaining where the fallback metrics came from.
    expect(read(SHARED_FONT_STYLESHEET)).not.toContain("from 'next/font'")
    expect(read('apps/smashers/src/styles/app.css')).not.toContain("from 'next/font'")
  })

  it('keeps the committed woff2 assets the shared stylesheet serves', () => {
    const assets = 'packages/ui/src/lib/fonts/assets'
    for (const file of [
      'ibm-plex-sans-400.woff2',
      'lilita-one-400.woff2',
      'press-start-2p-400.woff2',
    ]) {
      expect(existsSync(join(process.cwd(), assets, file)), file).toBe(true)
    }
    expect(
      existsSync(
        join(process.cwd(), 'packages/ui/src/lib/fonts/NexaRustSans_Black/NexaRustSans-Black.woff2')
      )
    ).toBe(true)
    expect(read(SHARED_FONT_STYLESHEET)).not.toContain('ibm-plex-sans-italic-400.woff2')
  })

  it('keeps only the browser-ready Nexa Rust font asset', () => {
    const fontDirectory = join(process.cwd(), 'packages/ui/src/lib/fonts/NexaRustSans_Black')

    expect(existsSync(join(fontDirectory, 'NexaRustSans-Black.woff2'))).toBe(true)
    for (const legacyAsset of [
      'NexaRustSans-Black.eot',
      'NexaRustSans-Black.otf',
      'NexaRustSans-Black.ttf',
      'NexaRustSans-Black.woff',
      'style.css',
    ]) {
      expect(existsSync(join(fontDirectory, legacyAsset))).toBe(false)
    }
  })

  it('leaves docs on its own single face while it has no Tailwind theme', () => {
    // Docs is Starlight: no Tailwind, no shared theme, and one family. Adopting
    // the shared stylesheet would add three unused faces to every inlined page
    // for a single declaration it already owns, so it stays out deliberately.
    const source = read('apps/docs/src/styles/theme.css')

    expect(source).toContain("font-family: 'IBM Plex Sans'")
    expect(source).not.toContain('@nl/ui/styles/fonts.css')
  })
})
