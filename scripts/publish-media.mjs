#!/usr/bin/env bun
/**
 * Publishes the website media set to the CDN bucket.
 *
 * Uploads every file under `assets/media/` to the `media/` prefix of the
 * `nifty-league` R2 bucket (served at cdn.niftyleague.com), then regenerates
 * `assets/media-manifest.json` — the committed record of what the CDN should
 * hold. Site assets (`assets/site/`) are NOT published here: they ship inside
 * each app's build like any other publicDir file.
 *
 * Media is append-only (a changed image is a new file), so every object is
 * uploaded with an immutable one-year Cache-Control. There is no purge path on
 * this bucket, which is exactly why mutable paths must never be re-uploaded
 * over: pick a new name instead.
 *
 * The manifest is a merge, not a snapshot: entries for files that exist locally
 * are refreshed, and entries for files that were deleted from the repo after
 * publishing (the repo only carries site/ long-term) are kept so the manifest
 * keeps describing everything the CDN holds. Pass --prune-missing to drop
 * entries that no longer exist locally once you have verified the CDN no
 * longer needs them either.
 *
 * Usage:
 *   CLOUDFLARE_API_TOKEN=… CLOUDFLARE_ACCOUNT_ID=… bun scripts/publish-media.mjs [--dry-run] [--only <subpath>] [--prune-missing]
 *
 * `--only` limits the upload to files under a subpath of assets/media (the
 * manifest is still regenerated from the full set).
 */
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative, extname } from 'node:path'

const BUCKET = 'nifty-league'
const SOURCE_DIR = 'assets/media'
const KEY_PREFIX = 'media'
const MANIFEST_PATH = 'assets/media-manifest.json'
const CACHE_CONTROL = 'public, max-age=31536000, immutable'
const CONCURRENCY = 8

const CONTENT_TYPES = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.json': 'application/json',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const onlyIndex = args.indexOf('--only')
const only = onlyIndex === -1 ? undefined : args[onlyIndex + 1]
const pruneMissing = args.includes('--prune-missing')
const token = process.env.CLOUDFLARE_API_TOKEN
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID

if (!dryRun && (!token || !accountId)) {
  console.error(
    'Usage: CLOUDFLARE_API_TOKEN=… CLOUDFLARE_ACCOUNT_ID=… bun scripts/publish-media.mjs [--dry-run] [--only <subpath>]'
  )
  process.exit(2)
}

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(full)))
    else files.push(full)
  }
  return files.toSorted()
}

const contentTypeFor = (file) =>
  CONTENT_TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream'

// The API rejects raw slashes in a percent-encoded key segment, so encode
// each path segment separately.
const encodedKey = (key) => key.split('/').map(encodeURIComponent).join('/')

const upload = async (key, body, contentType) => {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${BUCKET}/objects/${encodedKey(key)}`
  for (let attempt = 1; ; attempt += 1) {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': contentType,
        'cache-control': CACHE_CONTROL,
      },
      body,
    })
    if (response.ok) return
    if (attempt >= 2)
      throw new Error(`${response.status} uploading ${key}: ${await response.text()}`)
    console.error(`  retrying ${key} after ${response.status}`)
  }
}

const files = (await walk(SOURCE_DIR)).filter(
  (file) => !only || relative(SOURCE_DIR, file).startsWith(only)
)
if (files.length === 0) {
  console.error(`No files under ${SOURCE_DIR}${only ? ` matching ${only}` : ''}`)
  process.exit(1)
}

const manifest = existsSync(MANIFEST_PATH) ? JSON.parse(await readFile(MANIFEST_PATH, 'utf8')) : {}
const localBefore = Object.keys(manifest).length
let uploaded = 0
let failed = false
const queue = [...files]
const worker = async () => {
  for (;;) {
    const file = queue.shift()
    if (!file) return
    const relativePath = relative(SOURCE_DIR, file)
    const key = `${KEY_PREFIX}/${relativePath}`
    const body = await readFile(file)
    const contentType = contentTypeFor(file)
    manifest[relativePath] = {
      bytes: body.byteLength,
      sha256: createHash('sha256').update(body).digest('hex'),
      contentType,
    }
    if (dryRun) {
      console.log(`DRY   ${key} (${(body.byteLength / 1024).toFixed(1)} KB)`)
      continue
    }
    try {
      await upload(key, body, contentType)
      uploaded += 1
      if (uploaded % 25 === 0) console.log(`  ${uploaded}/${files.length} uploaded`)
    } catch (error) {
      failed = true
      console.error(`FAIL  ${key}: ${error.message}`)
    }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker))

if (pruneMissing) {
  for (const published of Object.keys(manifest)) {
    if (!existsSync(join(SOURCE_DIR, published))) delete manifest[published]
  }
}
await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`)
const kept = Object.keys(manifest).length - files.length
console.log(
  `\n${dryRun ? 'Dry run' : 'Published'} ${files.length} files under ${KEY_PREFIX}/; manifest holds ${Object.keys(manifest).length} entries (${Math.max(kept, 0)} CDN-only kept, was ${localBefore})`
)
process.exit(failed ? 1 : 0)
