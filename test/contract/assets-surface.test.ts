import { describe, expect, it } from 'bun:test'
import { existsSync, lstatSync, readdirSync, readFileSync, readlinkSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Shared assets surface contract.
 *
 * The repo-root `assets/` dir is the Astro apps' publicDir — the small
 * same-origin set every app ships (favicons, icons, logos, scripts, terms). If
 * it (or a symlink, or a critical subdir) disappears, every app silently 404s
 * those assets — with no in-repo click-through to catch it. This test pins that
 * structure.
 *
 * Marketing media is NOT here: it is published to cdn.niftyleague.com/media and
 * assets/media-manifest.json records what the CDN must hold. The only media
 * kept in the repo is the artwork builds read from disk, and that lives with
 * its consumers — `apps/docs/src/assets/` (Astro image imports) and
 * `apps/api/assets/` (API image-generator sources).
 *
 * web ships as Astro static and has no public symlink: its publicDir is the
 * shared assets dir directly (see apps/web/astro.config.mjs).
 */

const APPS = ['app', 'smashers', 'docs']

const ASSET_SUBDIRS = ['img/logos', 'icons', 'favicon', 'scripts']
const SOURCE_ROOTS = [
  'apps/web/src',
  'apps/app/src',
  'apps/docs/src',
  'apps/smashers/src',
  'packages/ui/src',
]

/**
 * Files each app generates into its own output. They must never live in the
 * shared assets directory: every Astro app uses `../../assets` as its
 * publicDir, so anything left there is copied into *every* app's build. Stale
 * staging files from the pre-migration build sat here and replaced apps/web's
 * own sitemap in local builds, which is how this guard came about.
 */
const GENERATED_SEO_FILES = ['robots.txt', 'sitemap.xml', 'sitemap-index.xml', 'sitemap-0.xml']

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

describe('shared assets surface contract', () => {
  it('assets dir exists at repo root', () => {
    expect(existsSync(join(process.cwd(), 'assets')), 'Missing repo-root assets/ dir').toBe(true)
  })

  it('critical site-asset subdirs exist', () => {
    for (const sub of ASSET_SUBDIRS) {
      expect(existsSync(join(process.cwd(), 'assets', sub)), `Missing assets/${sub}/`).toBe(true)
    }
  })

  it('the manifest describes the published set and build-time images live with their consumers', () => {
    // Everything else was published to cdn.niftyleague.com and removed from
    // the repo; only the artwork builds read from disk stays, next to the
    // code that reads it.
    const manifest = JSON.parse(
      readFileSync(join(process.cwd(), 'assets/media-manifest.json'), 'utf8')
    )
    expect(Object.keys(manifest).length, 'manifest lost entries').toBeGreaterThan(300)
    const buildTimeImages = [
      'apps/docs/src/assets/comics/page/1.webp',
      'apps/docs/src/assets/comics/page/6.webp',
      'apps/docs/src/assets/backgrounds/banner-light.webp',
      'apps/docs/src/assets/games/smashers/2D-levels/mars.webp',
      'apps/docs/src/assets/games/smashers/3D-levels/sushi_cropped.webp',
      'apps/docs/src/assets/roadmap/nifty_roadmap.webp',
      'apps/api/assets/items/full/1.gif',
      'apps/api/assets/items/full/7.gif',
    ]
    for (const file of buildTimeImages) {
      expect(existsSync(join(process.cwd(), file)), `Missing build-time image ${file}`).toBe(true)
    }
  })

  it('every media URL an app references is published in the manifest', () => {
    // Media lives on cdn.niftyleague.com, not in any build output, so a
    // reference to an unpublished path is a runtime 404 with no build-time
    // click-through. This is that click-through: every media URL in app or
    // package source must have an entry in assets/media-manifest.json.
    const manifest = JSON.parse(
      readFileSync(join(process.cwd(), 'assets/media-manifest.json'), 'utf8')
    )
    const published = new Set(Object.keys(manifest))
    const refs = new Set<string>()
    for (const root of SOURCE_ROOTS) {
      for (const file of walk(join(process.cwd(), root))) {
        if (!/\.(ts|tsx|astro|mdx|md|mjs|js)$/.test(file)) continue
        const text = readFileSync(file, 'utf8')
        for (const match of text.matchAll(/cdn\.niftyleague\.com\/media\/([A-Za-z0-9._/%-]+)/g)) {
          refs.add(decodeURIComponent(match[1] as string))
        }
      }
    }
    expect(refs.size, 'expected apps to reference published media').toBeGreaterThan(0)
    // A trailing slash means the source builds the filename at runtime (e.g.
    // `/credits/${name}.webp`); for those, a published entry under the prefix
    // is the strongest claim we can check statically.
    const prefixes = [...published]
    for (const ref of refs) {
      if (ref.endsWith('/')) {
        expect(
          prefixes.some((key) => key.startsWith(ref)),
          `Referenced media prefix has no published entries: media/${ref}`
        ).toBe(true)
      } else {
        expect(published.has(ref), `Referenced media is not published: media/${ref}`).toBe(true)
      }
    }
  })

  it('web serves the shared assets dir directly via its Astro publicDir', () => {
    const astroConfig = readFileSync(join(process.cwd(), 'apps/web/astro.config.mjs'), 'utf8')
    // The value now comes from @nl/astro-config, shared with smashers and docs.
    expect(astroConfig).toContain('publicDir: ASSETS_PUBLIC_DIR')
    const shared = readFileSync(join(process.cwd(), 'packages/astro-config/index.mjs'), 'utf8')
    expect(shared).toContain("export const ASSETS_PUBLIC_DIR = '../../assets'")
  })

  it('keeps generated SEO files out of the shared assets dir', () => {
    const root = join(process.cwd(), 'assets')
    const present = readdirSync(root).filter(
      (entry) =>
        GENERATED_SEO_FILES.includes(entry) ||
        /^sitemap.*\.xml$/.test(entry) ||
        entry === 'robots.txt'
    )

    expect(
      present,
      `Generated files must be written to an app's own output: ${present.join(', ')}`
    ).toEqual([])
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
