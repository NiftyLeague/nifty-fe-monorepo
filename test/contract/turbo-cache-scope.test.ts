import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'

const turbo = JSON.parse(readFileSync('turbo.json', 'utf8')) as {
  globalEnv?: string[]
  globalDependencies?: string[]
  tasks: Record<
    string,
    {
      cache?: boolean
      env?: string[]
      dependsOn?: string[]
      inputs?: string[]
      outputs?: string[]
    }
  >
}
const rootPackage = JSON.parse(readFileSync('package.json', 'utf8')) as {
  scripts?: Record<string, string>
}

const envFor = (task: string) => new Set(turbo.tasks[task]?.env ?? [])
const dependenciesFor = (task: string) => turbo.tasks[task]?.dependsOn ?? []
const inputsFor = (task: string) => turbo.tasks[task]?.inputs ?? []
const commonBuildInputExclusions = [
  '!**/README.md',
  '!**/CHANGELOG.md',
  '!**/*.test.*',
  '!**/*.spec.*',
  '!**/__tests__/**',
]
const buildInputExclusions: Record<string, string[]> = {
  'api#build': commonBuildInputExclusions,
  'app#build': [
    '!**/README.md',
    '!**/CHANGELOG.md',
    '!src/types/typechain/**',
    '!**/*.test.*',
    '!**/*.spec.*',
    '!**/__tests__/**',
  ],
  'docs#build': commonBuildInputExclusions,
  'smashers#build': ['!../../packages/playfab/src/test-mock-sdk.ts', ...commonBuildInputExclusions],
  'template#build': commonBuildInputExclusions,
  'web#build': commonBuildInputExclusions,
}
const sharedBuildInputs: Record<string, string[]> = {
  'api#build': ['../../packages/contracts/src/**', '../../packages/contracts/package.json'],
  'app#build': [
    '../../config/image-device-sizes.ts',
    '../../packages/contracts/src/**',
    '../../packages/contracts/package.json',
    '../../packages/imx-passport/src/**',
    '../../packages/imx-passport/package.json',
    '../../packages/sentry-client/src/**',
    '../../packages/sentry-client/package.json',
    '../../packages/ui/src/**',
    '../../packages/ui/package.json',
  ],
  'docs#build': ['../../packages/ui/src/**', '../../packages/ui/package.json'],
  'smashers#build': [
    '../../config/image-device-sizes.ts',
    '../../packages/playfab/src/**',
    '../../packages/playfab/package.json',
    '../../packages/sentry-client/src/**',
    '../../packages/sentry-client/package.json',
    '../../packages/ui/src/**',
    '../../packages/ui/package.json',
  ],
  'template#build': ['../../packages/ui/src/**', '../../packages/ui/package.json'],
  'web#build': [
    '../../config/image-device-sizes.ts',
    '../../packages/sentry-client/src/**',
    '../../packages/sentry-client/package.json',
    '../../packages/ui/src/**',
    '../../packages/ui/package.json',
  ],
}
const packageJson = (path: string) =>
  JSON.parse(readFileSync(path, 'utf8')) as {
    scripts?: Record<string, string>
  }

describe('Turbo cache environment scope', () => {
  it('builds only workspaces with a real build script', () => {
    expect(rootPackage.scripts?.build).toBe(
      'turbo run api#build app#build docs#build smashers#build template#build web#build'
    )
  })

  it('does not invalidate every workspace for app-specific credentials', () => {
    expect(turbo.globalEnv ?? []).toEqual(['CI', 'VERCEL_ENV'])
  })

  it('keeps local environment files scoped to the builds that consume them', () => {
    expect(turbo.globalDependencies ?? []).toEqual(['.env'])

    for (const task of [
      'api#build',
      'app#build',
      'docs#build',
      'smashers#build',
      'template#build',
      'web#build',
    ]) {
      expect(inputsFor(task)).toEqual([
        '$TURBO_DEFAULT$',
        ...(sharedBuildInputs[task] ?? []),
        '.env*',
        '!.env.example',
        ...(buildInputExclusions[task] ?? []),
      ])
    }
  })

  it('invalidates app builds when their shared workspace sources change', () => {
    for (const [task, inputs] of Object.entries(sharedBuildInputs)) {
      expect(inputsFor(task)).toEqual([
        '$TURBO_DEFAULT$',
        ...inputs,
        '.env*',
        '!.env.example',
        ...(buildInputExclusions[task] ?? []),
      ])
    }
  })

  it('excludes generated type declarations and test-only dependencies from production builds', () => {
    expect(inputsFor('app#build')).toContain('!src/types/typechain/**')
    expect(inputsFor('smashers#build')).toContain('!../../packages/playfab/src/test-mock-sdk.ts')
  })

  it('keeps environment inputs on the builds that read them', () => {
    expect(envFor('app#build')).toEqual(
      new Set([
        'CI',
        'NEXT_RUNTIME',
        'NEXT_PUBLIC_*',
        'SENTRY_AUTH_TOKEN',
        'SENTRY_ORG',
        'SENTRY_PROJECT',
        'VERCEL_ENV',
      ])
    )
    expect(envFor('web#build')).toEqual(
      new Set([
        'CI',
        'EDGE_CONFIG',
        'NEXT_RUNTIME',
        'NEXT_PUBLIC_*',
        'SENTRY_AUTH_TOKEN',
        'SENTRY_ORG',
        'SENTRY_PROJECT',
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
        'SENTRY_ORG',
        'SENTRY_PROJECT',
        'TWITCH_CLIENT_ID',
        'TWITCH_CLIENT_SECRET',
        'VERCEL_ENV',
      ])
    )
  })

  it('caches the deterministic Docusaurus build output', () => {
    expect(turbo.tasks['docs#build']?.cache).not.toBe(false)
    expect(turbo.tasks['docs#build']?.outputs).toEqual(['build/**', '.docusaurus/**'])
    expect(envFor('docs#build')).toEqual(new Set(['ALGOLIA_API_KEY', 'ALGOLIA_APP_ID']))
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
      'template#build',
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
