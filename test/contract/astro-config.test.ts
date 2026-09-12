import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Shared Astro configuration contract.
 *
 * The three Astro apps (`web`, `smashers`, `docs`) restated the same build
 * defaults: the app `local()` helper, the `@` source alias, `inlineStylesheets`,
 * the assets `publicDir`, and the Bun-isolated-layout `ssr.noExternal` pair with
 * its rationale. Those live in `@nl/astro-config` now, and the shared TypeScript
 * options live in `@nl/typescript-config/astro.json`.
 *
 * Two rules keep the arrangement honest:
 *  - plugin and integration instances stay app-local, because Bun's isolated
 *    layout resolves them through the app's own store entry;
 *  - `paths` stays app-local too, since a relative path in an extended config
 *    resolves against the config that declares it, not the one that extends it.
 */

const APP_CONFIGS = {
  docs: 'apps/docs/astro.config.mjs',
  smashers: 'apps/smashers/astro.config.mjs',
  web: 'apps/web/astro.config.mjs',
}

const APP_TSCONFIGS = {
  docs: 'apps/docs/tsconfig.json',
  smashers: 'apps/smashers/tsconfig.json',
  web: 'apps/web/tsconfig.json',
}

const SHARED_TSCONFIG_OPTIONS = [
  'jsx',
  'jsxImportSource',
  'verbatimModuleSyntax',
  'resolveJsonModule',
  'allowJs',
  'checkJs',
]

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8')

describe('shared astro configuration contract', () => {
  it('has every Astro app take its defaults from @nl/astro-config', () => {
    for (const [app, path] of Object.entries(APP_CONFIGS)) {
      const source = read(path)

      expect(source, `${app} must import the shared defaults`).toContain("from '@nl/astro-config'")
      // The restated pieces this replaced must not creep back.
      expect(source, `${app} must not redeclare the local() helper`).not.toContain('fileURLToPath')
      expect(source, `${app} must not restate the SSR workaround`).not.toContain(
        'environments: { ssr:'
      )
      expect(source, `${app} must not restate the source alias`).not.toContain(
        "{ find: '@', replacement:"
      )
    }
  })

  it('keeps plugin instances and integration wiring app-local', () => {
    // A shared instance would resolve from the config package's store entry.
    const shared = read('packages/astro-config/index.mjs')

    for (const forbidden of ["from 'astro", "'@tailwindcss/vite'", "'@astrojs/", 'defineConfig']) {
      expect(shared, `astro-config must not import ${forbidden}`).not.toContain(forbidden)
    }
    expect(JSON.parse(read('packages/astro-config/package.json')).dependencies).toBeUndefined()

    for (const [app, path] of Object.entries(APP_CONFIGS)) {
      const source = read(path)
      expect(source, `${app} must keep its own integrations`).toContain('integrations:')
    }
  })

  it('publishes the entry points the apps import', () => {
    expect(JSON.parse(read('packages/astro-config/package.json')).exports).toEqual({
      '.': './index.mjs',
    })
    const typeScriptConfig = JSON.parse(read('packages/typescript-config/astro.json'))
    expect(typeScriptConfig.display).toBe('Astro App')
  })

  it('extends the shared Astro tsconfig base instead of restating its options', () => {
    for (const [app, path] of Object.entries(APP_TSCONFIGS)) {
      const config = JSON.parse(read(path)) as {
        extends: string[]
        compilerOptions: Record<string, unknown>
      }

      expect(config.extends, `${app} must extend the Astro preset and the shared base`).toEqual([
        'astro/tsconfigs/strict',
        '@nl/typescript-config/astro.json',
      ])
      for (const option of SHARED_TSCONFIG_OPTIONS) {
        expect(config.compilerOptions, `${app} must not restate ${option}`).not.toHaveProperty(
          option
        )
      }
      // Relative paths resolve against the declaring config, so they stay here.
      expect(config.compilerOptions).toHaveProperty('paths')
    }
  })

  it('declares the shared packages where they are consumed', () => {
    for (const app of ['docs', 'smashers', 'web']) {
      const manifest = JSON.parse(read(`apps/${app}/package.json`)) as {
        devDependencies?: Record<string, string>
      }

      expect(manifest.devDependencies?.['@nl/astro-config'], `${app} needs astro-config`).toBe(
        'workspace:*'
      )
      expect(
        manifest.devDependencies?.['@nl/typescript-config'],
        `${app} needs the tsconfig base`
      ).toBe('workspace:*')
    }
  })
})
