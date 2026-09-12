import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Release coverage (#1841): every workspace package that carries a version is
 * tracked by Release Please, and Release Please tracks nothing that does not
 * exist. The gap this guard closes is real — `packages/astro-config` shipped in
 * the M4 migration without a config entry, so its changes produced no release
 * bumps, while the manifest still listed `packages/theme`, dropped releases ago.
 */
const config = JSON.parse(readFileSync('release-please-config.json', 'utf8')) as {
  packages: Record<string, unknown>
}
const manifest = JSON.parse(readFileSync('.release-please-manifest.json', 'utf8')) as Record<
  string,
  string
>

const versionedWorkspaces = (): string[] => {
  const roots = ['apps', 'packages']
  const found: string[] = []
  for (const root of roots) {
    for (const entry of readdirSync(root)) {
      const dir = join(root, entry)
      if (!statSync(dir).isDirectory()) continue
      const manifestPath = join(dir, 'package.json')
      if (!existsSync(manifestPath)) continue
      const pkg = JSON.parse(readFileSync(manifestPath, 'utf8')) as { version?: string }
      if (pkg.version) found.push(`${dir}`)
    }
  }
  return found.sort()
}

describe('release coverage', () => {
  it('tracks every versioned workspace package', () => {
    for (const dir of versionedWorkspaces()) {
      expect(config.packages, `${dir} is missing from release-please-config.json`).toHaveProperty(
        dir
      )
      expect(manifest, `${dir} is missing from .release-please-manifest.json`).toHaveProperty(dir)
    }
  })

  it('tracks no package that no longer exists', () => {
    for (const tracked of [...Object.keys(config.packages), ...Object.keys(manifest)].filter(
      (key) => key !== '.'
    )) {
      expect(existsSync(join(tracked, 'package.json')), `${tracked} is tracked but gone`).toBe(true)
    }
  })
})
