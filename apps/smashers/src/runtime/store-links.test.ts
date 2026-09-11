import { describe, expect, it } from 'bun:test'

import { getStoreLinks } from './store-links'

/**
 * The store links silently 404'd in the Vercel preview because the routes inlined
 * `PUBLIC_*` at build time while the live project holds `NEXT_PUBLIC_*`. Reading
 * both spellings at request time is what makes the rename safe, so both are
 * pinned here.
 */
describe('store link configuration', () => {
  it('resolves the NEXT_PUBLIC_ names the live Vercel project holds', () => {
    const links = getStoreLinks({
      NEXT_PUBLIC_APPLE_STORE_ID: 'id-from-next-public',
      NEXT_PUBLIC_APPLE_STORE_LINK: 'https://apple.example/next',
      NEXT_PUBLIC_GOOGLE_PLAY_LINK: 'https://play.example/next',
      NEXT_PUBLIC_EPIC_LINK: 'https://epic.example/next',
      NEXT_PUBLIC_STEAM_LINK: 'https://steam.example/next',
    })

    expect(links).toEqual({
      appleStoreId: 'id-from-next-public',
      appleStoreLink: 'https://apple.example/next',
      googlePlayLink: 'https://play.example/next',
      epicLink: 'https://epic.example/next',
      steamLink: 'https://steam.example/next',
    })
  })

  it('resolves the PUBLIC_ names the Astro convention uses', () => {
    const links = getStoreLinks({
      PUBLIC_APPLE_STORE_ID: 'id-from-public',
      PUBLIC_APPLE_STORE_LINK: 'https://apple.example/public',
      PUBLIC_GOOGLE_PLAY_LINK: 'https://play.example/public',
      PUBLIC_EPIC_LINK: 'https://epic.example/public',
      PUBLIC_STEAM_LINK: 'https://steam.example/public',
    })

    expect(links.appleStoreId).toBe('id-from-public')
    expect(links.steamLink).toBe('https://steam.example/public')
  })

  it('prefers the PUBLIC_ name when both are present', () => {
    const links = getStoreLinks({
      PUBLIC_STEAM_LINK: 'https://steam.example/public',
      NEXT_PUBLIC_STEAM_LINK: 'https://steam.example/next',
    })

    expect(links.steamLink).toBe('https://steam.example/public')
  })

  it('reports missing configuration as undefined rather than an empty string', () => {
    const links = getStoreLinks({})
    for (const value of Object.values(links)) expect(value).toBeUndefined()
  })
})
