import { describe, expect, it } from 'bun:test'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

/**
 * Stale-code guards (M4.4).
 *
 * A file nothing imports is dead weight that the build cannot report: bundlers
 * silently drop it, so it survives cleanups until someone greps for it. The
 * sweep that produced this file found five orphaned CSS modules whose components
 * had been deleted two releases earlier (#790 removed the components but left the
 * stylesheets).
 */

const SCAN_ROOTS = ['apps', 'packages']
const SKIP_DIRS = [
  'node_modules',
  'dist',
  'build',
  '.astro',
  '.vercel',
  '.turbo',
  '.web-images',
  '.app',
  'typechain',
]

const collect = (dir: string, match: (name: string) => boolean, out: string[] = []): string[] => {
  for (const entry of readdirSync(join(process.cwd(), dir))) {
    if (SKIP_DIRS.includes(entry) || entry.startsWith('.')) continue
    const path = join(dir, entry)
    if (statSync(join(process.cwd(), path)).isDirectory()) collect(path, match, out)
    else if (match(entry)) out.push(path)
  }
  return out
}

/** Every source file that could import something, concatenated for searching. */
const sourceBlob = () =>
  SCAN_ROOTS.flatMap((root) => collect(root, (name) => /\.(ts|tsx|astro|mjs|js|json)$/.test(name)))
    .map((path) => readFileSync(join(process.cwd(), path), 'utf8'))
    .join('\n')

describe('stale code', () => {
  it('has no orphaned CSS modules', () => {
    const blob = sourceBlob()
    const modules = SCAN_ROOTS.flatMap((root) =>
      collect(root, (name) => name.endsWith('.module.css'))
    )

    const orphaned = modules.filter((path) => {
      const name = path.split('/').pop() as string
      // A CSS module only applies when imported; a mention of its filename in any
      // source file is the reference (the files themselves are in the blob, which
      // is why the check looks for the name rather than an import statement).
      return !blob.includes(name)
    })

    expect(
      orphaned.map((path) => relative(process.cwd(), path)),
      'A CSS module nothing imports contributes to no bundle: delete it, or import it'
    ).toEqual([])
  })

  it('has no module barrel left without consumers', () => {
    // `index` files are entry points by convention, so only flag one whose name
    // appears nowhere else; the deleted gltf boundary left none behind.
    const blob = sourceBlob()
    const candidates = SCAN_ROOTS.flatMap((root) =>
      collect(root, (name) => /^index\.(ts|tsx|mjs)$/.test(name))
    ).filter((path) => path.includes('/src/'))

    const orphans = candidates.filter((path) => {
      const directory = path.split('/').slice(-2, -1)[0] as string
      // Reachable if the directory name is mentioned (barrel imports) or the
      // path is referenced directly.
      return !blob.includes(`${directory}/index`) && !blob.includes(directory)
    })

    expect(orphans.map((path) => relative(process.cwd(), path))).toEqual([])
  })
})
