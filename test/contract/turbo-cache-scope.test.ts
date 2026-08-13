import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'

const turbo = JSON.parse(readFileSync('turbo.json', 'utf8')) as {
  globalEnv?: string[]
  tasks: Record<string, { env?: string[] }>
}

const envFor = (task: string) => new Set(turbo.tasks[task]?.env ?? [])

describe('Turbo cache environment scope', () => {
  it('does not invalidate every workspace for app-specific credentials', () => {
    expect(turbo.globalEnv ?? []).toEqual(['CI', 'VERCEL_ENV'])
  })

  it('keeps environment inputs on the builds that read them', () => {
    expect(envFor('app#build')).toEqual(
      new Set(['CI', 'NEXT_RUNTIME', 'NEXT_PUBLIC_*', 'SENTRY_AUTH_TOKEN', 'VERCEL_ENV'])
    )
    expect(envFor('web#build')).toEqual(
      new Set([
        'CI',
        'EDGE_CONFIG',
        'NEXT_RUNTIME',
        'NEXT_PUBLIC_*',
        'SENTRY_AUTH_TOKEN',
        'VERCEL_ENV',
      ])
    )
    expect(envFor('smashers#build')).toEqual(
      new Set([
        'APPLE_CLIENT_ID',
        'APPLE_CLIENT_SECRET',
        'CI',
        'FACEBOOK_CLIENT_ID',
        'FACEBOOK_CLIENT_SECRET',
        'GITHUB_ACTIONS',
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'NEXT_PHASE',
        'NEXT_RUNTIME',
        'NEXT_PUBLIC_*',
        'NEXTAUTH_SECRET',
        'PLAYFAB_API_KEY',
        'SENTRY_AUTH_TOKEN',
        'TWITCH_CLIENT_ID',
        'TWITCH_CLIENT_SECRET',
        'VERCEL_ENV',
      ])
    )
  })
})
