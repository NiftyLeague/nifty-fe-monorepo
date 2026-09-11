/**
 * Store and referral deep-link configuration.
 *
 * Read from `process.env` at request time rather than inlined at build time:
 * these routes are server-rendered, and the values differ per environment
 * (production vs preview storefronts) without any build difference. Inlining
 * them also made the routes silently return 404 when the deployment named the
 * variables differently from the code.
 *
 * `env` is injectable so the resolution can be tested without mutating the real
 * process environment.
 */
export interface StoreLinks {
  appleStoreId?: string
  appleStoreLink?: string
  googlePlayLink?: string
  epicLink?: string
  steamLink?: string
}

export const getStoreLinks = (
  env: Record<string, string | undefined> = process.env
): StoreLinks => ({
  // `|| undefined` keeps an empty value indistinguishable from an unset one:
  // callers must not treat '' as a configured link.
  appleStoreId: env.PUBLIC_APPLE_STORE_ID || undefined,
  appleStoreLink: env.PUBLIC_APPLE_STORE_LINK || undefined,
  googlePlayLink: env.PUBLIC_GOOGLE_PLAY_LINK || undefined,
  epicLink: env.PUBLIC_EPIC_LINK || undefined,
  steamLink: env.PUBLIC_STEAM_LINK || undefined,
})

export default getStoreLinks
