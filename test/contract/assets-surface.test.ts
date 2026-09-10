import { describe, expect, it } from 'bun:test'
import { existsSync, lstatSync, readFileSync, readlinkSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Shared assets surface contract.
 *
 * The Next/Vercel apps' `public/` dirs are symlinks to the repo-root `assets/` dir. If the
 * `assets` dir (or a symlink, or a critical subdir) disappears, every app silently
 * 404s its images, favicons, and videos — with no in-repo click-through to catch it.
 * This test pins that structure.
 *
 * web ships as Astro static and has no public symlink: its publicDir is the shared
 * assets dir directly (see apps/web/astro.config.mjs).
 */

const APPS = ['app', 'smashers', 'docs']

const ASSET_SUBDIRS = ['img', 'icons', 'favicon', 'video']

describe('shared assets surface contract', () => {
  it('assets dir exists at repo root', () => {
    expect(existsSync(join(process.cwd(), 'assets')), 'Missing repo-root assets/ dir').toBe(true)
  })

  it('critical asset subdirs exist', () => {
    for (const sub of ASSET_SUBDIRS) {
      expect(existsSync(join(process.cwd(), 'assets', sub)), `Missing assets/${sub}/`).toBe(true)
    }
  })

  it('web serves the shared assets dir directly via its Astro publicDir', () => {
    const astroConfig = readFileSync(join(process.cwd(), 'apps/web/astro.config.mjs'), 'utf8')
    expect(astroConfig).toContain("publicDir: '../../assets'")
  })

  for (const app of APPS) {
    it(`apps/${app}/public is a symlink to the shared assets dir`, () => {
      const publicDir = join(process.cwd(), 'apps', app, 'public')
      expect(existsSync(publicDir), `Missing apps/${app}/public`).toBe(true)
      expect(lstatSync(publicDir).isSymbolicLink(), `apps/${app}/public is not a symlink`).toBe(
        true
      )
      const target = readlinkSync(publicDir)
      expect(target, `apps/${app}/public points outside repo-root assets`).toContain('assets')
    })

    it(`apps/${app}/public resolves to a real directory`, () => {
      const publicDir = join(process.cwd(), 'apps', app, 'public')
      expect(existsSync(join(publicDir, 'img')), `apps/${app}/public/img unreachable`).toBe(true)
    })
  }
})
