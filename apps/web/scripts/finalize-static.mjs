import { cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { HEADERS_FILE } from './static-headers.mjs'

const app = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const output = join(app, 'dist')
await mkdir(join(output, '__images'), { recursive: true })
for (const name of await readdir(join(app, '.web-images'))) {
  if (name.endsWith('.webp'))
    await cp(join(app, '.web-images', name), join(output, '__images', name))
}

// Inject a preload for each document's LCP candidate: the first eager,
// high-priority image in the markup. Discovery otherwise waits for CSS and
// HTML scanning, which costs the LCP animation frame on throttled mobile.
async function injectHeroPreload(file) {
  const html = await readFile(file, 'utf8')
  // LCP candidate: the first high-priority image in the document.
  const candidates = html.match(/<img\b[^>]*>/g) ?? []
  const img = candidates.find((tag) => /\bfetchpriority="high"/i.test(tag))
  if (!img) return false
  const attr = (name) => {
    const match = new RegExp(`\\b${name}="([^"]*)"`).exec(img)
    return match?.[1]
  }
  const src = attr('src')
  if (!src || /^https?:/.test(src)) return false
  const preload = attr('srcSet')
    ? `<link rel="preload" as="image" href="${src}" imagesrcset="${attr('srcSet')}" imagesizes="${attr('sizes') ?? '100vw'}" fetchpriority="high" />`
    : `<link rel="preload" as="image" href="${src}" fetchpriority="high" />`
  // Preloads must precede the inlined stylesheets for early discovery.
  const anchor = html.indexOf('<style')
  if (anchor === -1) return false
  await writeFile(file, html.slice(0, anchor) + preload + html.slice(anchor))
  return true
}

let injected = 0
// Top-level documents (format: 'file')
for (const name of await readdir(output)) {
  if (!name.endsWith('.html')) continue
  if (await injectHeroPreload(join(output, name))) injected++
}
// Shell documents keep their poster handled by the Worker; skip shells/.
console.log(`Injected hero image preloads into ${injected} documents.`)

// The Workers assets surface consumes this file; production Vercel reads
// vercel.json. static-headers.mjs documents why both exist.
await writeFile(join(output, '_headers'), HEADERS_FILE)
await writeFile(
  join(output, 'robots.txt'),
  `User-agent: *
Allow: /
Disallow: /shells/
Disallow: /invite/
Disallow: /party/
Sitemap: https://niftyleague.com/sitemap.xml
`
)
console.log('Wrote robots.txt and generated image variants.')
