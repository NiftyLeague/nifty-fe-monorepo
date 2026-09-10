import { cp, mkdir, readdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const app = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const output = join(app, 'dist')
await mkdir(join(output, '__images'), { recursive: true })
for (const name of await readdir(join(app, '.web-images'))) {
  if (name.endsWith('.webp'))
    await cp(join(app, '.web-images', name), join(output, '__images', name))
}
// Write only to web's generated output. apps/web/public points at shared assets.
await writeFile(
  join(output, '_headers'),
  `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/_astro/*
  Access-Control-Allow-Origin: *
  Cache-Control: public, max-age=31536000, immutable

/__images/*
  Access-Control-Allow-Origin: *
  Cache-Control: public, max-age=31536000, immutable
`
)
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
console.log('Wrote app-scoped static headers, robots.txt and generated image variants.')
