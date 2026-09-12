'use client'

export type Provider =
  | 'google'
  | 'apple'
  | 'facebook'
  | 'twitch'
  | 'discord' // not implemented in playfab
  | 'twitter' // not implemented in playfab

// The allowlist is injected at build time by the consuming app (Astro `define`
// or Vite `define`), so it is read through `import.meta.env` rather than a
// runtime `process`.
const PROVIDERS = import.meta.env.PUBLIC_AUTH_PROVIDERS as string
const PROVIDERS_LIST = PROVIDERS ? (PROVIDERS.split(',') as Provider[]) : []

export function useProviders(): Provider[] {
  return PROVIDERS_LIST
}

export default useProviders
