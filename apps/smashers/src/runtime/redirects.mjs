/**
 * Store deep links and referral redirects.
 *
 * These sources are consumed outside the site — Unity games, native app deep
 * links, App Store and store campaigns, and share URLs — so they are pinned by
 * the redirect-surface contract. They lived in `next.config.ts`; the Astro app
 * resolves them at request time in `src/middleware.ts` so the destinations can
 * still come from per-environment configuration.
 *
 * Pure and dependency-free so it can be tested without a running server.
 */

/** Apple App Store campaign attribution query shared by the iOS deep links. */
const IOS_CAMPAIGN = '?pt=118779175&ct=Nifty%20Smashers%20Website&mt=8'

/** Countries whose storefront gets a country-specific App Store link. */
export const APPLE_COUNTRY_CODES = ['AU', 'BR', 'CA', 'US']

export const STORE_PATHS = /** @type {const} */ ({
  '/android': 'GOOGLE_PLAY',
  '/epic': 'EPIC',
  '/steam': 'STEAM',
})

const appleStoreLink = (env, countryCode = '') => {
  const id = env.APPLE_STORE_ID
  if (countryCode && id) {
    return `https://apps.apple.com/${countryCode.toLowerCase()}/app/${id}`
  }
  return env.APPLE_STORE_LINK ?? ''
}

/**
 * Appends the campaign params to a store link, keeping any query the link
 * already carries.
 */
const withCampaign = (link) => {
  if (!link) return ''
  if (link.includes('pt=')) return link
  return `${link}${link.includes('?') ? '&' : '?'}${IOS_CAMPAIGN.slice(1)}`
}

/**
 * @param {{ pathname: string, country?: string, userAgent?: string }} request
 * @param {Record<string, string | undefined>} env
 * @returns {{ destination: string, status: 307 | 308 } | null}
 */
export function resolveRedirect(request, env = {}) {
  const { pathname, country = '', userAgent = '' } = request

  // iOS: a country storefront wins over the generic App Store link.
  if (pathname === '/ios' || pathname.startsWith('/ios/')) {
    const suffix = pathname.slice('/ios'.length)
    const normalizedCountry = country.toUpperCase()
    if (APPLE_COUNTRY_CODES.includes(normalizedCountry) && env.APPLE_STORE_ID) {
      return {
        destination: `${appleStoreLink(env, normalizedCountry)}${suffix}${IOS_CAMPAIGN}`,
        status: 307,
      }
    }
    const fallback = withCampaign(appleStoreLink(env))
    if (fallback) return { destination: `${fallback}${suffix}`, status: 307 }
  }

  for (const [path, envKey] of Object.entries(STORE_PATHS)) {
    if (pathname !== path && !pathname.startsWith(`${path}/`)) continue
    const destination = env[envKey]
    if (!destination) continue
    return { destination: `${destination}${pathname.slice(path.length)}`, status: 307 }
  }

  // Referral deep links: mobile visitors go straight to the matching store,
  // everyone else stays on the marketing site with the referral preserved.
  const invite = /^\/invite\/(\w{1,})\/?$/.exec(pathname)
  if (invite) {
    const refCode = invite[1]
    const isIos = /iPhone|iPad|iPod/i.test(userAgent)
    const isAndroid = /Android|Mobile/i.test(userAgent) && !isIos

    if (isIos && appleStoreLink(env)) {
      return {
        destination: `${appleStoreLink(env)}?referral=${refCode}`,
        status: 307,
      }
    }
    if (isAndroid && env.GOOGLE_PLAY) {
      return { destination: `${env.GOOGLE_PLAY}?referral=${refCode}`, status: 307 }
    }
    if (!isIos && !isAndroid) {
      return { destination: `/?referral=${refCode}`, status: 307 }
    }
  }

  return null
}
