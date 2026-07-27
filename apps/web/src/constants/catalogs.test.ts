import { describe, expect, it } from 'bun:test'
const catalogLoaders = {
  careers: () => import('./careers'),
  contracts: () => import('./contracts'),
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
})
