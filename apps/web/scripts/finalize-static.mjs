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

// Inject a preload for every eager, high-priority image in a document: each
// one is an above-the-fold LCP candidate whose discovery otherwise waits for
// CSS and HTML scanning, which costs the LCP animation frame on throttled
// mobile. Art-directed `<picture>` heroes carry their candidates on a
// `<source>`, so the hint is read from the enclosing source instead, with its
// media pinned on the link so the non-matching breakpoint does not download it.
async function injectHeroPreload(file) {
  const html = await readFile(file, 'utf8')
  const attr = (tag, name) => new RegExp(`\\b${name}="([^"]*)"`, 'i').exec(tag)?.[1]
  const preloads = []
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\bfetchpriority="high"/i.test(match[0])) continue
    let srcSet = attr(match[0], 'srcSet')
    let sizes = attr(match[0], 'sizes')
    let media
    let src = attr(match[0], 'src')
    if (!srcSet) {
      // The <source> immediately governing this <img> holds the responsive
      // candidates; the img's own src is the non-matching-breakpoint fallback.
      // React emits camelCase srcSet; HTML attributes match case-insensitively.
      const source = [
        ...html.slice(0, match.index).matchAll(/<source\b[^>]*srcset="[^"]*"[^>]*>/gi),
      ].at(-1)
      if (!source) continue
      srcSet = attr(source[0], 'srcset')
      sizes = attr(source[0], 'sizes')
      media = attr(source[0], 'media')
      src = srcSet.split(',').at(-1)?.trim().split(/\s+/)[0]
    }
    if (!src || /^(https?:|data:)/.test(src)) continue
    const mediaAttr = media ? ` media="${media}"` : ''
    preloads.push(
      srcSet
        ? `<link rel="preload" as="image"${mediaAttr} href="${src}" imagesrcset="${srcSet}" imagesizes="${sizes ?? '100vw'}" fetchpriority="high" />`
        : `<link rel="preload" as="image"${mediaAttr} href="${src}" fetchpriority="high" />`
    )
  }
  if (preloads.length === 0) return false
  // Preloads must precede the inlined stylesheets for early discovery.
  const anchor = html.indexOf('<style')
  if (anchor === -1) return false
  await writeFile(file, html.slice(0, anchor) + preloads.join('') + html.slice(anchor))
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
