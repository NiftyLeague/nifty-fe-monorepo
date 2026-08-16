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

    const collectComicImages = (node: unknown): Array<{ alt?: string; sizes?: string }> => {
      if (Array.isArray(node)) return node.flatMap(collectComicImages)
      if (!node || typeof node !== 'object') return []

      const props = (node as { props?: { alt?: string; children?: unknown; sizes?: string } }).props
      if (!props) return []

      const image = props.alt?.startsWith('comic ') ? [{ alt: props.alt, sizes: props.sizes }] : []
      return [...image, ...collectComicImages(props.children)]
    }

    const images = collectComicImages(comicsCard?.body)

    expect(images).toHaveLength(6)
    expect(images.every(({ sizes }) => sizes === '(max-width: 767px) 50vw, 250px')).toBe(true)
  })
})
