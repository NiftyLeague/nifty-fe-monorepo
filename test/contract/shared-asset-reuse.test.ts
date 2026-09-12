import { describe, expect, it } from 'bun:test'
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

/**
 * M4.2 shared-asset and shared-behaviour contract.
 *
 * Three audits support this issue: asset reuse (hash-checked), token ownership,
 * and icon vocabulary. Each produced a verdict, and each verdict needs a test
 * that fails when someone undoes it.
 */

const ASSETS = 'assets'

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8')

const collectFiles = (dir: string, out: string[] = []): string[] => {
  for (const entry of readdirSync(join(process.cwd(), dir))) {
    if (entry.startsWith('.')) continue
    const path = join(dir, entry)
    if (statSync(join(process.cwd(), path)).isDirectory()) collectFiles(path, out)
    else out.push(path)
  }
  return out
}

/**
 * Duplicate *content* is allowed only where the same artwork is published under
 * two semantic paths: a DEGEN's gallery image and the copy a team-card or grail
 * table references. Both paths are live, so collapsing them would break one
 * surface's contract to save a few kilobytes.
 */
const isIntentionalVariantPair = (paths: string[]) => {
  const hasGalleryCopy = paths.some((path) => path.includes('/degens/nfts/'))
  const hasCuratedCopy = paths.some(
    (path) => path.includes('/degens/team/') || path.includes('/degens/grails/')
  )
  return hasGalleryCopy && hasCuratedCopy
}

describe('shared asset reuse', () => {
  it('stores duplicate asset content only as the registered DEGEN variants', () => {
    const byHash = new Map<string, string[]>()
    for (const file of collectFiles(ASSETS)) {
      const digest = createHash('sha256').update(readFileSync(file)).digest('hex')
      byHash.set(digest, [...(byHash.get(digest) ?? []), relative(process.cwd(), file)])
    }

    const unregistered = [...byHash.values()]
      .filter((paths) => paths.length > 1 && !isIntentionalVariantPair(paths))
      .map((paths) => paths.join(' == '))

    expect(
      unregistered,
      'Duplicate asset content must be an intentional variant pair (degens/nfts against degens/team or degens/grails), or the file should be referenced instead of copied'
    ).toEqual([])
  })

  it('keeps the shared assets dir free of generated files', () => {
    const generated = readdirSync(join(process.cwd(), ASSETS)).filter(
      (entry) => entry === 'robots.txt' || /^sitemap.*\.xml$/.test(entry)
    )

    // Every Astro app uses ../../assets as publicDir, so a generated file here
    // would be copied into each app's output.
    expect(generated).toEqual([])
  })
})

describe('shared image behaviour', () => {
  it('keeps the attribute contract in one module', () => {
    const core = read('packages/ui/src/lib/image-attributes.ts')

    for (const rule of [
      'Image src is required',
      "decoding: attributes.decoding ?? 'async'",
      "priority || preload ? 'eager' : 'lazy'",
      'IMAGE_FILL_STYLE',
    ]) {
      expect(core, `the shared core owns: ${rule}`).toContain(rule)
    }
  })

  it('has every surface delegate to it instead of restating the derivation', () => {
    const surfaces = {
      'apps/web/src/runtime/image-props.mjs': "from '@nl/ui/lib/image-attributes'",
      'apps/smashers/src/runtime/Image.tsx': "from '@nl/ui/lib/image-attributes'",
      'packages/ui/src/components/custom/optimized-image/index.tsx':
        "from '@nl/ui/lib/image-attributes'",
    }

    for (const [path, importLine] of Object.entries(surfaces)) {
      const source = read(path)
      expect(source, `${path} must use the shared contract`).toContain(importLine)
      // The rules themselves must not be restated alongside the import.
      expect(source, `${path} must not restate the loader defaults`).not.toContain(
        "decoding: attributes.decoding ?? 'async'"
      )
    }
  })

  it('keeps each optimizer app-local', () => {
    // The optimisers genuinely differ: web resolves build-time variants from a
    // manifest, smashers calls the Vercel image service.
    expect(read('apps/web/src/runtime/image-props.mjs')).toContain('/__images/')
    expect(read('apps/smashers/src/runtime/Image.tsx')).toContain('/_vercel/image?url=')
  })
})

describe('shared icon vocabulary', () => {
  it('keeps the shared nav glyphs inline rather than importing an icon library', () => {
    const source = read('packages/ui/src/components/custom/nav-icon/index.tsx')

    // Replacing these with static `lucide-react` imports was measured and
    // rejected: the shared registry is imported by every navbar, and the static
    // imports added three module-preload entries (chevron-down, chevron-right,
    // layout-grid) to every page that renders one. The glyphs are byte-identical
    // to lucide's, so inlining them here costs nothing but keeps the graph flat.
    expect(source).not.toContain("from 'lucide-react'")
    expect(source).toContain('const iconPaths = {')
  })

  it('keeps the private app shell on direct icon imports', () => {
    // The app's own navigation is a separate bundle boundary on purpose; the
    // performance contract in app-performance.test.ts pins the same rule.
    const source = read('apps/app/src/components/AppNavIcon.tsx')

    expect(source).toContain("from 'lucide-react'")
  })
})
