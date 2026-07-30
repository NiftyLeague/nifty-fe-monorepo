'use client'

export type Provider =
  | 'google'
  | 'apple'
  | 'facebook'
  | 'twitch'
  | 'discord' // not implemented in playfab
  | 'twitter' // not implemented in playfab

const PROVIDERS = process.env.NEXT_PUBLIC_AUTH_PROVIDERS as string
const PROVIDERS_LIST = PROVIDERS ? (PROVIDERS.split(',') as Provider[]) : []

export function useProviders(): Provider[] {
  return PROVIDERS_LIST
}

export default useProviders
