import { render } from '@nl/ui/test-utils'
import { describe, expect, it } from 'bun:test'

const catalogLoaders = {
  careers: () => import('./careers'),
  degens: () => import('./degens'),
  games: () => import('./games'),
  niftyworld: () => import('./niftyworld'),
  sponsors: () => import('./sponsors'),
  team: () => import('./team'),
  learnCards: () => import('../components/LearnCards/constants'),
  roadmap: () => import('../components/RoadmapTimeline/constants'),
  socialCards: () => import('../components/SocialCards/constants'),
}

describe('website catalogs', () => {
  it.each(Object.entries(catalogLoaders))(
    '%s loads a non-empty catalog',
    async (_name, loadModule) => {
      const catalog = await loadModule()
      expect(Object.keys(catalog).length).toBeGreaterThan(0)
      expect(Object.values(catalog).some(Boolean)).toBe(true)
    }
  )

  it('keeps the Roadmap comic thumbnails responsive and lazy', async () => {
    const { ROADMAP_CARDS } = await import('../components/RoadmapTimeline/constants')
    const comicsCard = ROADMAP_CARDS.find((card) => card.title === 'Comics Burning')

    // Solid builds real DOM at JSX evaluation, so inspect the rendered output
    // instead of walking a virtual element tree.
    const { container } = render(() => comicsCard?.body ?? null)
    const images = [...container.querySelectorAll('img[alt^="comic "]')].map((image) => ({
      alt: image.getAttribute('alt') ?? undefined,
      sizes: image.getAttribute('sizes') ?? undefined,
    }))

    expect(images).toHaveLength(6)
    expect(images.every(({ sizes }) => sizes === '(max-width: 767px) 50vw, 250px')).toBe(true)
  })
})
