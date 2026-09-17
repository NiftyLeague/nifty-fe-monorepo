import { readdir, readFile, mkdir, writeFile, stat } from 'node:fs/promises'
import { dirname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import sharp from 'sharp'
import { candidateWidths, IMAGE_QUALITIES } from '../src/runtime/image-props.mjs'
import {
  isProductionImageSource,
  runWithConcurrency,
} from '../../../packages/astro-config/image-pipeline.mjs'

const app = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const assets = resolve(app, '../../assets')
const output = join(app, '.web-images')
const metadataOnly = process.argv.includes('--metadata-only')
await mkdir(output, { recursive: true })

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const results = []
  for (const entry of entries) {
    if (['node_modules', '.git', '.next', '.astro', 'dist'].includes(entry.name)) continue
    const path = join(directory, entry.name)
    if (entry.isDirectory()) results.push(...(await files(path)))
    else if (entry.isFile()) results.push(path)
  }
  return results
}

if (!metadataOnly) {
  const references = new Set()
  for (const root of [join(app, 'src'), resolve(app, '../../packages/ui/src')]) {
    for (const path of await files(root)) {
      if (!isProductionImageSource(path, ['.ts', '.tsx', '.astro', '.css', '.json'])) continue
      const source = await readFile(path, 'utf8')
      for (const match of source.matchAll(
        /['"`(](\/img\/[^'"`()$?#]+\.(?:png|jpe?g|webp))['"`)]/gi
      ))
        references.add(match[1])
    }
  }
  const manifest = {}
  // Process serially so image generation does not exhaust memory on CI.
  for (const source of [...references].toSorted()) {
    const file = resolve(assets, source.slice(1))
    if (!file.startsWith(`${assets}${sep}`)) throw new Error(`Unsafe asset path: ${source}`)
    try {
      if (!(await stat(file)).isFile()) continue
    } catch {
      continue
    }
    const input = await readFile(file)
    const metadata = await sharp(input).metadata()
    if (!metadata.width || !metadata.height || (metadata.pages ?? 1) > 1) continue
    const hash = createHash('sha256')
      .update('web-astro-images-v1')
      .update(input)
      .digest('hex')
      .slice(0, 20)
    const variants = candidateWidths(metadata.width).flatMap((width) =>
      IMAGE_QUALITIES.map((quality) => ({ quality, width }))
    )
    await runWithConcurrency(variants, async ({ quality, width }) => {
      const target = join(output, `${hash}-${width}-q${quality}.webp`)
      try {
        await stat(target)
        return
      } catch {
        /* New content-addressed variant. */
      }
      await sharp(input)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality })
        .toFile(target)
    })
    manifest[source] = { hash, width: metadata.width, height: metadata.height }
  }
  await writeFile(join(output, 'manifest.json'), JSON.stringify(manifest) + '\n')
  console.log(`Prepared responsive variants for ${Object.keys(manifest).length} source images.`)
} else {
  try {
    await stat(join(output, 'manifest.json'))
  } catch {
    await writeFile(join(output, 'manifest.json'), '{}\n')
  }
}
