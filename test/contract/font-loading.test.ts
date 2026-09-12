import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const appFontStylesheet = 'apps/app/src/styles/fonts.css'
const appFontRuntime = 'apps/app/src/runtime/fonts.ts'
const appRootLayout = 'apps/app/src/routes/__root.tsx'

describe('shared font loading contract', () => {
  it('app self-hosts its three families from a dedicated stylesheet', () => {
    // The app ships as TanStack Start: the shared `@nl/ui/fonts/*` helpers are a
    // build-time font pipeline, so the woff2 assets are self-hosted from CSS and
    // mapped onto the same `--font-*` custom properties the Tailwind theme uses.
    const source = readFileSync(join(process.cwd(), appFontStylesheet), 'utf8')

    expect(source).toContain('woff2')
    for (const family of ['NL IBM Plex Sans', 'NL Nexa Rust Sans Black', 'NL Lilita One']) {
      expect(source).toContain(`font-family: '${family}'`)
    }
    for (const cssVar of [
      '--font-ibm-plex-sans',
      '--font-nexa-rust-sans-black',
      '--font-lilita-one',
    ]) {
      expect(source).toContain(cssVar)
    }
    // The Press Start 2P display face is only used by smashers.
    expect(source).not.toContain('press-start-2p-400.woff2')
    // The build-time font pipeline must not come back.
    expect(source).not.toContain('next/font')
  })

  it('app keeps a framework-neutral stand-in for the shared font exports', () => {
    const source = readFileSync(join(process.cwd(), appFontRuntime), 'utf8')

    for (const family of ['NL IBM Plex Sans', 'NL Nexa Rust Sans Black', 'NL Lilita One']) {
      expect(source).toContain(family)
    }
  })

  it('app loads the font stylesheet from the root route', () => {
    const source = readFileSync(join(process.cwd(), appRootLayout), 'utf8')
    const css = readFileSync(join(process.cwd(), 'apps/app/src/styles/app.css'), 'utf8')

    expect(css).toContain("import './fonts.css'")
    expect(source).toContain('appCss')
  })

  it('smashers self-hosts its four families from the Astro base layout', () => {
    // smashers ships as Astro SSR: the base layout self-hosts the same woff2
    // assets the way apps/web does.
    const source = readFileSync(join(process.cwd(), 'apps/smashers/src/layouts/Base.astro'), 'utf8')

    expect(source).toContain('woff2')
    expect(source).toContain('preload')
    // default (IBM Plex Sans), header (Nexa Rust), subheader (Lilita One), special (Press Start 2P)
    expect(source).toContain('ibm-plex-sans-400.woff2')
    expect(source).toContain('NexaRustSans-Black.woff2')
    expect(source).toContain('lilita-one-400.woff2')
    expect(source).toContain('press-start-2p-400.woff2')
    for (const cssVar of [
      '--font-ibm-plex-sans',
      '--font-nexa-rust-sans-black',
      '--font-lilita-one',
      '--font-press-start',
    ]) {
      expect(source).toContain(cssVar)
    }
    expect(source).not.toContain('ibm-plex-sans-italic-400.woff2')
  })

  it('web loads only the font families required by its theme via the Astro base layout', () => {
    // web ships as Astro static; fonts come from src/layouts/Base.astro, which
    // self-hosts the same woff2 assets instead of importing @nl/ui fonts.
    const source = readFileSync(join(process.cwd(), 'apps/web/src/layouts/Base.astro'), 'utf8')

    expect(source).toContain('woff2')
    expect(source).toContain('preload')
    // default (IBM Plex Sans), header (Nexa Rust Sans Black), special (Press Start 2P)
    expect(source).toContain('ibm-plex-sans-400.woff2')
    expect(source).toContain('NexaRustSans-Black.woff2')
    expect(source).toContain('press-start-2p-400.woff2')
    for (const cssVar of [
      '--font-ibm-plex-sans',
      '--font-nexa-rust-sans-black',
      '--font-press-start-2p',
    ]) {
      expect(source).toContain(cssVar)
    }
    expect(source).not.toContain('ibm-plex-sans-italic-400.woff2')
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

  it('keeps the committed woff2 assets the app self-hosts', () => {
    // The font modules that wrapped these in a build-time pipeline are gone,
    // but the woff2 files stay: the app's stylesheet serves them.
    const assets = 'packages/ui/src/lib/fonts/assets'
    for (const file of ['ibm-plex-sans-400.woff2', 'lilita-one-400.woff2']) {
      expect(existsSync(join(process.cwd(), assets, file)), file).toBe(true)
    }
    expect(
      existsSync(
        join(process.cwd(), 'packages/ui/src/lib/fonts/NexaRustSans_Black/NexaRustSans-Black.woff2')
      )
    ).toBe(true)
  })
})
