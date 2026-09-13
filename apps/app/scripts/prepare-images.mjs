import { readdir, readFile, mkdir, writeFile, stat } from 'node:fs/promises'
import { join, resolve, dirname, sep, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import sharp from 'sharp'
import { candidateWidths, IMAGE_QUALITIES } from '../src/runtime/image-props.mjs'

const app = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(app, 'public')
const output = join(app, '.app-images')
await mkdir(output, { recursive: true })

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const results = []
  for (const entry of entries) {
    if (['node_modules', '.git', '.output', '.vercel', '.app-images'].includes(entry.name)) continue
    const path = join(directory, entry.name)
    if (entry.isDirectory()) results.push(...(await files(path)))
    else if (entry.isFile()) results.push(path)
  }
  return results
}

// The static `/img/...` references in app and shared-UI source. API-driven
// sources (`/img/degens/nfts/<id>.webp` and friends) never appear as string
// literals, so they stay on the original files by design — 10k NFT images
// cannot be enumerated at build time.
const references = new Set()
for (const root of [join(app, 'src'), resolve(app, '../../packages/ui/src')]) {
  for (const path of await files(root)) {
    if (!['.ts', '.tsx', '.css', '.json'].includes(extname(path))) continue
    const source = await readFile(path, 'utf8')
    for (const match of source.matchAll(/['"`(](\/img\/[^'"`()$?#]+\.(?:png|jpe?g|webp))['"`)]/gi))
      references.add(match[1])
  }
}

const manifest = {}
// Serial processing so image generation does not exhaust memory on CI.
for (const source of [...references].toSorted()) {
  const file = resolve(publicDir, source.slice(1))
  if (!file.startsWith(`${publicDir}${sep}`)) throw new Error(`Unsafe asset path: ${source}`)
  try {
    if (!(await stat(file)).isFile()) continue
  } catch {
    continue
  }
  const input = await readFile(file)
  const metadata = await sharp(input).metadata()
  // Multi-page inputs are animated (WebP/GIF): serving a still would lie.
  if (!metadata.width || !metadata.height || (metadata.pages ?? 1) > 1) continue
  const hash = createHash('sha256')
    .update('app-vite-images-v1')
    .update(input)
    .digest('hex')
    .slice(0, 20)
  const widths = candidateWidths(metadata.width)
  for (const width of widths)
    for (const quality of IMAGE_QUALITIES) {
      const target = join(output, `${hash}-${width}-q${quality}.webp`)
      try {
        await stat(target)
        continue
      } catch {
        /* New content-addressed variant. */
      }
      await sharp(input)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality })
        .toFile(target)
    }
  manifest[source] = { hash, width: metadata.width, height: metadata.height }
}
await writeFile(join(output, 'manifest.json'), JSON.stringify(manifest) + '\n')
console.log(`Prepared responsive variants for ${Object.keys(manifest).length} source images.`)
