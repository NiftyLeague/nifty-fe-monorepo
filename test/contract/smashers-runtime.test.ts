import { describe, expect, it } from 'bun:test'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const SMASHERS = 'apps/smashers'
const pagesDir = join(SMASHERS, 'src/pages')
const layoutsDir = join(SMASHERS, 'src/layouts')

const readAll = (dir: string, ext: string, found: string[] = []): string[] => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) readAll(full, ext, found)
    else if (full.endsWith(ext)) found.push(full)
  }
  return found
}

const astroFiles = [...readAll(pagesDir, '.astro'), ...readAll(layoutsDir, '.astro')]
const read = (path: string) => readFileSync(path, 'utf8')

const cssRule = (css: string, selector: string) =>
  new RegExp(`${selector}\\s*\\{([^}]*)\\}`).exec(css.replace(/\/\*[\s\S]*?\*\//g, ''))?.[1] ?? ''

describe('smashers island hydration', () => {
  it('never nests a client directive inside another client directive', () => {
    for (const file of astroFiles) {
      const source = read(file)
      const opens = [...source.matchAll(/<([a-zA-Z][\w.]*)\b[^>]*\bclient:[\w-]+/g)]
      const closes: number[] = []
      for (const match of source.matchAll(/<\/?([a-zA-Z][\w.]*)\b[^>]*?(\/?)>/g)) {
        if (match[0].startsWith('</')) closes.push(match.index ?? 0)
      }

      for (const open of opens) {
        const start = open.index ?? 0
        const tag = open[1] as string
        // Find this element's closing tag and check nothing inside it is an island.
        const closePattern = new RegExp(`</${tag}>`)
        const rest = source.slice(start)
        const closeIndex = rest.search(closePattern)
        if (closeIndex === -1) continue
        const inner = rest.slice(0, closeIndex)
        const nested = /<[a-zA-Z][\w.]*\b[^>]*\bclient:[\w-]+/.exec(inner.slice(open[0].length))
        expect(
          nested,
          `${file}: island <${tag}> contains a nested island (<${nested?.[0]?.slice(0, 40)}>), which gets its own React root and will not receive context`
        ).toBeNull()
      }
    }
  })

  it('hydrates the interactive header subtrees on the home page', () => {
    const source = read(join(pagesDir, 'index.astro'))

    // The hero backdrop is static markup above the fold; only the action
    // buttons (Play/Trailer/Credits) need hydration.
    const usage = /<ActionButtonsGroup\b[^>]*\bclient:[\w-]+/
    expect(source, 'ActionButtonsGroup must carry a client directive').toMatch(usage)
    expect(source).not.toMatch(/<picture[^>]*\bclient:[\w-]+/)
  })

  it('keeps the header shell free of the provider islands', () => {
    // Header renders server-side; importing the interactive children directly
    // would ship them without directives again.
    const header = read(join(SMASHERS, 'src/components/Header/index.tsx'))

    expect(header).not.toContain("from './DeferredHeroBackground'")
    expect(header).not.toContain("from './ActionButtonsGroup'")
    expect(header).toContain('heroBackground')
    expect(header).toContain('actionButtons')
  })

  it('keeps the auth layout a plain shell with no provider island', () => {
    const layout = read(join(layoutsDir, 'Auth.astro'))

    expect(layout).not.toMatch(/AuthProviders[\s\S]{0,80}client:/)
    expect(layout).toContain('<slot />')
  })

  it('renders providers inside each auth page island so context is shared', () => {
    for (const [component, page] of [
      ['LoginClient', 'login.astro'],
      ['ProfileClient', 'profile.astro'],
    ] as const) {
      const client = read(
        join(
          SMASHERS,
          `src/components/${component === 'LoginClient' ? 'login' : 'profile'}/${component}.tsx`
        )
      )
      expect(client, `${component} must render its own providers`).toContain(
        "from '@/contexts/AuthProviders'"
      )
      expect(client).toContain('<AuthProviders>')

      const pageSource = read(join(pagesDir, page))
      expect(pageSource).toContain('client:load')
    }
  })
})

describe('unset public env vars', () => {
  it('treats an empty inlined env value as unset', () => {
    const source = read(join(SMASHERS, 'src/contexts/FeatureFlagsProvider.tsx'))

    // The guard must reject the empty string explicitly.
    expect(source).toMatch(/if \(!storedValue \|\| .*trim\(\) === ''/)
    expect(source).not.toMatch(/storedValue === undefined\s*\n?\s*\?\s*DEFAULT_FLAGS/)
  })

  it('wraps flag parsing so malformed JSON cannot throw during render', () => {
    const source = read(join(SMASHERS, 'src/contexts/FeatureFlagsProvider.tsx'))

    expect(source).toContain('try {')
    expect(source).toContain('catch {')
  })

  it('documents that an unset define yields an empty string', () => {
    const config = read(join(SMASHERS, 'astro.config.mjs'))

    expect(config).toContain("find(Boolean) ?? ''")
    expect(config).toMatch(/empty string/i)
  })
})

describe('smashers layer order', () => {
  it('keeps the hero button group out of the nav layer', () => {
    const css = read(join(SMASHERS, 'src/components/Header/ActionButtonsGroup/index.module.css'))

    expect(cssRule(css, '\\.heroBtnGroup')).not.toMatch(/z-index/)
  })

  it('raises the hero content layer above page content', () => {
    const css = read(join(SMASHERS, 'src/components/Header/index.module.css'))
    const zIndex = /z-index:\s*(-?\d+)/.exec(cssRule(css, '\\.heroContainer'))?.[1]

    expect(zIndex, 'the layer holding the fixed nav must set a z-index').toBeDefined()
    expect(Number(zIndex)).toBeGreaterThanOrEqual(10)
    expect(Number(zIndex)).toBeLessThan(1200)
  })

  it('keeps the nav above the hero button group', () => {
    const navCss = read(join(SMASHERS, 'src/components/Header/Navbar/index.module.css'))
    const btnCss = read(join(SMASHERS, 'src/components/Header/ActionButtonsGroup/index.module.css'))

    const navZ = Number(/z-index:\s*(\d+)/.exec(cssRule(navCss, '\\.navbar'))?.[1] ?? 0)
    const btnZ = Number(/z-index:\s*(\d+)/.exec(cssRule(btnCss, '\\.heroBtnGroup'))?.[1] ?? 0)

    expect(btnZ).toBeLessThan(navZ)
  })
})

describe('console-game decorative artwork', () => {
  const consoleGame = 'packages/ui/src/components/custom/console-game/index.tsx'

  it('gives decorative artwork an empty alt so browsers paint no placeholder', () => {
    const source = read(consoleGame)

    for (const alt of ['Bonk Sticker', 'Controller Left', 'Controller Right']) {
      expect(source, `${alt} should not be an alt (it renders as visible text)`).not.toContain(
        `alt="${alt}"`
      )
    }
    expect(source).toContain('alt=""')
  })

  it('keeps an accessible name on the play/pause control', () => {
    const source = read(consoleGame)

    expect(source).toMatch(/aria-label=\{isPlaying \? 'Pause video' : 'Play video'\}/)
  })

  it('keeps the meaningful backdrop alt', () => {
    const backdrop = read('packages/ui/src/components/custom/console-game/backdrop.tsx')

    expect(backdrop).toContain('alt="Game Console Backdrop"')
  })
})

describe('smashers back control', () => {
  it('renders a thin stroke at the original size', () => {
    const source = read(join(SMASHERS, 'src/components/Header/BackButton/index.tsx'))

    expect(source).toContain('size={48}')
    expect(source).toContain('absoluteStrokeWidth')
    expect(source).not.toMatch(/strokeWidth=\{4\}/)
  })
})
