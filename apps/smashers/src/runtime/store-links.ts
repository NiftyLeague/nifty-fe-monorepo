/**
 * Store and referral deep-link configuration.
 *
 * Read from `process.env` at request time rather than inlined at build time:
 * these routes are server-rendered, and the values differ per environment
 * (production vs preview storefronts) without any build difference. Inlining
 * them also made the routes silently return 404 when the deployment named the
 * variables differently from the code.
 *
 * Both spellings are accepted. `PUBLIC_*` is the convention the Astro apps
 * adopted; `NEXT_PUBLIC_*` is what the existing Vercel project still holds, and
 * is honoured so the cutover does not depend on renaming variables first.
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

const readEnv = (
  env: Record<string, string | undefined>,
  ...names: string[]
): string | undefined => {
  for (const name of names) {
    const value = env[name]
    if (value) return value
  }
  return undefined
}

export const getStoreLinks = (
  env: Record<string, string | undefined> = process.env
): StoreLinks => ({
  appleStoreId: readEnv(env, 'PUBLIC_APPLE_STORE_ID', 'NEXT_PUBLIC_APPLE_STORE_ID'),
  appleStoreLink: readEnv(env, 'PUBLIC_APPLE_STORE_LINK', 'NEXT_PUBLIC_APPLE_STORE_LINK'),
  googlePlayLink: readEnv(env, 'PUBLIC_GOOGLE_PLAY_LINK', 'NEXT_PUBLIC_GOOGLE_PLAY_LINK'),
  epicLink: readEnv(env, 'PUBLIC_EPIC_LINK', 'NEXT_PUBLIC_EPIC_LINK'),
  steamLink: readEnv(env, 'PUBLIC_STEAM_LINK', 'NEXT_PUBLIC_STEAM_LINK'),
})

export default getStoreLinks
