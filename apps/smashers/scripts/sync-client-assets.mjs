import { copyFileSync, existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * The @astrojs/cloudflare build emits vite-processed assets (web fonts and
 * friends) into `dist/server/_astro` while the Worker serves `dist/client`;
 * anything the client build did not emit itself never reaches the deployed
 * asset set, so its URLs 404. This syncs every server-emitted asset the
 * client output is missing, then fails the build if any asset referenced by
 * the prerendered HTML is still unresolvable — the check that would have
 * caught the missing fonts before they shipped.
 */

const root = join(process.cwd(), 'dist')
const serverAstro = join(root, 'server', '_astro')
const clientAstro = join(root, 'client', '_astro')

if (existsSync(serverAstro)) {
  if (!existsSync(clientAstro)) {
    const { mkdirSync } = await import('node:fs')
    mkdirSync(clientAstro, { recursive: true })
  }
  let copied = 0
  for (const file of readdirSync(serverAstro)) {
    const target = join(clientAstro, file)
    if (!existsSync(target)) {
      copyFileSync(join(serverAstro, file), target)
      copied += 1
    }
  }
  if (copied) console.log(`[sync-client-assets] copied ${copied} asset(s) into client/_astro`)
}

const clientDir = join(root, 'client')
const missing = new Set()
const scan = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) scan(full)
    else if (entry.name.endsWith('.html')) {
      const html = readFileSync(full, 'utf8')
      for (const ref of html.matchAll(/\/_astro\/[A-Za-z0-9._-]+/g)) {
        const asset = join(clientDir, ref[0])
        if (!existsSync(asset)) missing.add(ref[0])
      }
    }
  }
}
scan(clientDir)
if (missing.size) {
  console.error(`[sync-client-assets] HTML references missing assets: ${[...missing].join(', ')}`)
  process.exit(1)
}
console.log('[sync-client-assets] all referenced assets resolve')
