import { describe, expect, it } from 'bun:test'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

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
  packageManager?: string
  devEngines?: { packageManager?: { name?: string; version?: string } }
}

const envFor = (task: string) => new Set(turbo.tasks[task]?.env ?? [])
const dependenciesFor = (task: string) => turbo.tasks[task]?.dependsOn ?? []
const inputsFor = (task: string) => turbo.tasks[task]?.inputs ?? []
const testOnlyBuildInputExclusions = [
  '!**/*.test.*',
  '!**/*.spec.*',
  '!**/*.stories.*',
  '!**/*.story.*',
  '!**/__tests__/**',
]
const commonBuildInputExclusions = [
  '!**/README.md',
  '!**/CHANGELOG.md',
  ...testOnlyBuildInputExclusions,
]
const uiBuildInputExclusions = [
  '!../../packages/ui/src/**/*.test.*',
  '!../../packages/ui/src/**/*.spec.*',
  '!../../packages/ui/src/**/*.stories.*',
  '!../../packages/ui/src/**/*.story.*',
  '!../../packages/ui/src/**/__tests__/**',
]
const playfabBuildInputExclusions = [
  '!../../packages/playfab/src/**/*.test.*',
  '!../../packages/playfab/src/**/*.spec.*',
  '!../../packages/playfab/src/**/*.stories.*',
  '!../../packages/playfab/src/**/*.story.*',
  '!../../packages/playfab/src/**/__tests__/**',
]
const buildInputExclusions: Record<string, string[]> = {
  'api#build': commonBuildInputExclusions,
  'app#build': [
    '!**/README.md',
    '!**/CHANGELOG.md',
    '!src/types/typechain/**',
    ...testOnlyBuildInputExclusions,
    ...uiBuildInputExclusions,
  ],
  'docs#build': [...commonBuildInputExclusions, ...uiBuildInputExclusions],
  'smashers#build': [
    '!../../packages/playfab/src/test-mock-sdk.ts',
    ...commonBuildInputExclusions,
    ...uiBuildInputExclusions,
    ...playfabBuildInputExclusions,
  ],
  'web#build': [...commonBuildInputExclusions, ...uiBuildInputExclusions],
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
  // smashers ships as Astro SSR: no Next image-device-sizes config or
  // sentry-client sources feed its build; shared playfab and ui sources do.
  'smashers#build': [
    '../../packages/playfab/src/**',
    '../../packages/playfab/package.json',
    '../../packages/ui/src/**',
    '../../packages/ui/package.json',
  ],
  // web ships as Astro static: no Next image-device-sizes config or
  // sentry-client sources feed its build; only shared ui sources do.
  'web#build': ['../../packages/ui/src/**', '../../packages/ui/package.json'],
}
const packageJson = (path: string) =>
  JSON.parse(readFileSync(path, 'utf8')) as {
    scripts?: Record<string, string>
  }

describe('Turbo cache environment scope', () => {
  it('builds only workspaces with a real build script', () => {
    expect(rootPackage.scripts?.build).toBe(
      'turbo run api#build app#build docs#build smashers#build web#build'
    )
  })

  it('pins the package manager used by Vercel and local builds', () => {
    expect(rootPackage.packageManager).toBeUndefined()
    expect(rootPackage.devEngines?.packageManager).toEqual({ name: 'bun', version: '1.4.0' })
  })

  it('does not invalidate every workspace for app-specific credentials', () => {
    expect(turbo.globalEnv ?? []).toEqual(['CI', 'VERCEL_ENV'])
  })

  it('keeps local environment files scoped to the builds that consume them', () => {
    expect(turbo.globalDependencies ?? []).toEqual(['.env'])

    for (const task of ['api#build', 'app#build', 'docs#build', 'smashers#build', 'web#build']) {
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
      new Set(['CI', 'PUBLIC_DEPLOY_ENV', 'PUBLIC_TELEMETRY', 'PUBLIC_INFURA_ID'])
    )
    expect(envFor('smashers#build')).toEqual(
      new Set([
        'APPLE_CLIENT_ID',
        'APPLE_CLIENT_SECRET',
        'CI',
        'ENABLE_EXPERIMENTAL_COREPACK',
        'FACEBOOK_CLIENT_ID',
        'FACEBOOK_CLIENT_SECRET',
        'GITHUB_ACTIONS',
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'NEXTAUTH_SECRET',
        'PLAYFAB_API_KEY',
        'PUBLIC_*',
        'SESSION_SECRET',
        'SENTRY_AUTH_TOKEN',
        'SENTRY_ORG',
        'SENTRY_PROJECT',
        'TWITCH_CLIENT_ID',
        'TWITCH_CLIENT_SECRET',
        'VERCEL_ENV',
      ])
    )
  })

  it('names the environment variables each shared package actually reads', () => {
    // A declared-but-unread name (or a read-but-undeclared one) silently makes
    // the cache key wrong: the task reuses a result computed under different
    // configuration. This caught the env name drifting from the package source
    // when the PlayFab title id moved to the PUBLIC_* convention.
    const sources = {
      '@nl/playfab#lint': 'packages/playfab/src',
    } as const

    for (const [task, sourceDir] of Object.entries(sources)) {
      const declared = envFor(task)
      const read = new Set<string>()
      const walk = (dir: string) => {
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
          const full = join(dir, entry.name)
          if (entry.isDirectory()) {
            if (entry.name !== 'node_modules') walk(full)
          } else if (/\.(ts|tsx)$/.test(entry.name) && !/\.test\./.test(entry.name)) {
            const source = readFileSync(full, 'utf8')
            for (const match of source.matchAll(/process\.env\.([A-Z0-9_]+)/g)) {
              read.add(match[1] as string)
            }
          }
        }
      }
      walk(sourceDir)

      // Every declared env var must be one the package can actually read, and
      // every PlayFab variable it reads must be declared.
      for (const name of declared) {
        if (name === 'CI' || name === 'VERCEL_ENV') continue
        expect(read.has(name), `${task} declares ${name} but the package never reads it`).toBe(true)
      }
      for (const name of read) {
        if (!name.startsWith('PLAYFAB_')) continue
        expect(declared.has(name), `${task} must declare ${name}, which the package reads`).toBe(
          true
        )
      }
    }
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
