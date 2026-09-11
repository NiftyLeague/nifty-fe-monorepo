import { describe, expect, it } from 'bun:test'

import { getStoreLinks } from './store-links'

/**
 * The store links silently 404'd in the Vercel preview because the routes once
 * inlined build-time values instead of reading the environment per request.
 * These tests pin the request-time resolution against PUBLIC_* names.
 */
describe('store link configuration', () => {
  it('resolves the PUBLIC_ names the Astro convention uses', () => {
    const links = getStoreLinks({
      PUBLIC_APPLE_STORE_ID: 'id-from-public',
      PUBLIC_APPLE_STORE_LINK: 'https://apple.example/public',
      PUBLIC_GOOGLE_PLAY_LINK: 'https://play.example/public',
      PUBLIC_EPIC_LINK: 'https://epic.example/public',
      PUBLIC_STEAM_LINK: 'https://steam.example/public',
    })

    expect(links).toEqual({
      appleStoreId: 'id-from-public',
      appleStoreLink: 'https://apple.example/public',
      googlePlayLink: 'https://play.example/public',
      epicLink: 'https://epic.example/public',
      steamLink: 'https://steam.example/public',
    })
  })

  it('treats an empty value as unset', () => {
    const links = getStoreLinks({ PUBLIC_STEAM_LINK: '' })
    expect(links.steamLink).toBeUndefined()
  })

  it('reports missing configuration as undefined rather than an empty string', () => {
    const links = getStoreLinks({})
    for (const value of Object.values(links)) expect(value).toBeUndefined()
  })
})
