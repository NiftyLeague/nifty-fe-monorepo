import { describe, expect, it } from 'bun:test'

import { APPLE_COUNTRY_CODES, resolveRedirect } from './redirects.mjs'

const env = {
  APPLE_STORE_ID: 'nifty-smashers/id123456',
  APPLE_STORE_LINK: 'https://apps.apple.com/app/nifty-smashers/id123456',
  GOOGLE_PLAY: 'https://play.google.com/store/apps/details?id=com.niftyleague.smashers',
  EPIC: 'https://store.epicgames.com/en-US/p/nifty-smashers',
  STEAM: 'https://store.steampowered.com/app/1234560/Nifty_Smashers',
}

describe('App Store deep links', () => {
  it('sends the listed countries to their own storefront with campaign params', () => {
    for (const country of APPLE_COUNTRY_CODES) {
      const result = resolveRedirect({ pathname: '/ios', country }, env)
      expect(result?.destination).toStartWith(
        `https://apps.apple.com/${country.toLowerCase()}/app/nifty-smashers/id123456`
      )
      expect(result?.destination).toContain('pt=118779175')
      expect(result?.status).toBe(307)
    }
  })

  it('falls back to the configured link for other countries', () => {
    const result = resolveRedirect({ pathname: '/ios', country: 'DE' }, env)
    expect(result?.destination).toStartWith('https://apps.apple.com/app/nifty-smashers/id123456')
  })

  it('preserves sub-paths on the iOS deep link', () => {
    const result = resolveRedirect({ pathname: '/ios/foo/bar', country: 'US' }, env)
    expect(result?.destination).toContain('id123456/foo/bar')
  })

  it('does not redirect when no Apple link is configured', () => {
    expect(resolveRedirect({ pathname: '/ios', country: 'US' }, {})).toBeNull()
  })
})

describe('store redirects', () => {
  it('maps each store path to its configured destination', () => {
    expect(resolveRedirect({ pathname: '/android' }, env)?.destination).toBe(env.GOOGLE_PLAY)
    expect(resolveRedirect({ pathname: '/epic' }, env)?.destination).toBe(env.EPIC)
    expect(resolveRedirect({ pathname: '/steam' }, env)?.destination).toBe(env.STEAM)
  })

  it('carries the trailing path through', () => {
    expect(resolveRedirect({ pathname: '/steam/library' }, env)?.destination).toBe(
      `${env.STEAM}/library`
    )
  })

  it('stays put for stores without a destination', () => {
    expect(resolveRedirect({ pathname: '/steam' }, {})).toBeNull()
    expect(resolveRedirect({ pathname: '/android' }, {})).toBeNull()
  })
})

describe('referral deep links', () => {
  it('sends iOS visitors to the App Store with the referral', () => {
    const result = resolveRedirect(
      { pathname: '/invite/REFCODE12', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)' },
      env
    )
    expect(result?.destination).toBe(`${env.APPLE_STORE_LINK}?referral=REFCODE12`)
  })

  it('sends Android visitors to Google Play with the referral', () => {
    const result = resolveRedirect(
      { pathname: '/invite/REFCODE12', userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel)' },
      env
    )
    expect(result?.destination).toBe(`${env.GOOGLE_PLAY}?referral=REFCODE12`)
  })

  it('keeps desktop visitors on the site with the referral preserved', () => {
    const result = resolveRedirect(
      { pathname: '/invite/REFCODE12', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)' },
      env
    )
    expect(result?.destination).toBe('/?referral=REFCODE12')
  })

  it('ignores invite paths that carry no code', () => {
    expect(resolveRedirect({ pathname: '/invite/' }, env)).toBeNull()
    expect(resolveRedirect({ pathname: '/invite' }, env)).toBeNull()
  })
})

describe('unrelated paths', () => {
  it('leaves normal routes alone', () => {
    for (const pathname of ['/', '/login', '/profile', '/loot', '/api/playfab/login']) {
      expect(resolveRedirect({ pathname }, env)).toBeNull()
    }
  })
})
