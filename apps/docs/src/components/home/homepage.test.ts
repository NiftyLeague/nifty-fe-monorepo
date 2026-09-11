import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FEATURES, GITHUB_LINKS, GUIDE_LINKS, QUICK_LINKS, SOCIALS } from '../../lib/links'

const here = dirname(fileURLToPath(import.meta.url))
const read = (file: string) => readFileSync(join(here, file), 'utf8')

describe('documentation homepage content', () => {
  it('links every guide, repository, and quick link', () => {
    const source = read('Guides.astro')

    for (const { title, to } of [...GUIDE_LINKS, ...GITHUB_LINKS, ...QUICK_LINKS]) {
      expect(to).toBeTruthy()
      expect(title).toBeTruthy()
    }

    // The component maps over all three inventories, so every entry renders.
    expect(source).toContain('GUIDE_LINKS.map')
    expect(source).toContain('GITHUB_LINKS.map')
    expect(source).toContain('QUICK_LINKS.map')
    expect(GITHUB_LINKS.map((link) => link.title)).toContain('nifty-fe-monorepo')
  })

  it('keeps internal docs links behind the /docs prefix', () => {
    for (const { to } of [...FEATURES, ...GUIDE_LINKS, ...QUICK_LINKS]) {
      expect(to.startsWith('/docs/')).toBe(true)
    }

    for (const { to } of GITHUB_LINKS) {
      expect(to.startsWith('https://github.com/NiftyLeague/')).toBe(true)
    }

    for (const { href } of SOCIALS) {
      expect(href.startsWith('https://')).toBe(true)
    }
  })

  it('renders the three primary product feature cards', () => {
    const source = read('Features.astro')

    expect(FEATURES).toHaveLength(3)
    expect(FEATURES.map((feature) => feature.title)).toEqual([
      'What is Nifty League?',
      'Developers or Creators',
      'NFTL',
    ])
    expect(source).toContain('FEATURES.map')
  })

  it('defers the below-fold stream image', () => {
    const source = read('Socials.astro')

    expect(source).toContain('alt="Nifty League Twitch stream"')
    expect(source).toContain('loading="lazy"')
    expect(source).toContain('decoding="async"')
  })
})
