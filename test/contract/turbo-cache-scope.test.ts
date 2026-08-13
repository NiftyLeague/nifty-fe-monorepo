import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'

const turbo = JSON.parse(readFileSync('turbo.json', 'utf8')) as {
  globalEnv?: string[]
  tasks: Record<string, { env?: string[]; dependsOn?: string[] }>
}

const envFor = (task: string) => new Set(turbo.tasks[task]?.env ?? [])
const dependenciesFor = (task: string) => turbo.tasks[task]?.dependsOn ?? []
const packageJson = (path: string) =>
  JSON.parse(readFileSync(path, 'utf8')) as {
    scripts?: Record<string, string>
  }

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

  it('keeps test execution independent from write-mode quality tasks', () => {
    expect(dependenciesFor('test')).not.toContain('format')
    expect(dependenciesFor('test')).not.toContain('lint:fix')
    expect(dependenciesFor('test')).not.toContain('type-check')
    expect(dependenciesFor('api#test')).not.toContain('format')
    expect(dependenciesFor('api#test')).not.toContain('lint:fix')
    expect(dependenciesFor('api#test')).not.toContain('type-check')
  })

  it('does not schedule the removed no-op transit task', () => {
    expect(turbo.tasks.transit).toBeUndefined()
    for (const task of ['lint', 'lint:fix', 'format', 'type-check', 'api#lint', 'api#type-check']) {
      expect(dependenciesFor(task)).not.toContain('transit')
    }
  })

  it('does not wait on nonexistent source-package build tasks', () => {
    for (const task of [
      'build',
      'api#build',
      'app#build',
      'docs#build',
      'smashers#build',
      'web#build',
    ]) {
      expect(dependenciesFor(task)).not.toContain('^build')
    }

    for (const packagePath of [
      'packages/imx-passport/package.json',
      'packages/playfab/package.json',
      'packages/sentry-client/package.json',
      'packages/ui/package.json',
    ]) {
      expect(packageJson(packagePath).scripts?.build).toBeUndefined()
    }
  })
})
