'use client'

export type Provider =
  | 'google'
  | 'apple'
  | 'facebook'
  | 'twitch'
  | 'discord' // not implemented in playfab
  | 'twitter' // not implemented in playfab

import { PUBLIC_AUTH_PROVIDERS } from './auth-env'

// The allowlist is injected at build time by the consuming app (Astro `define`
// or Vite `define`).
const PROVIDERS = PUBLIC_AUTH_PROVIDERS as string
const PROVIDERS_LIST = PROVIDERS ? (PROVIDERS.split(',') as Provider[]) : []

export function useProviders(): Provider[] {
  return PROVIDERS_LIST
}

export default useProviders
