import { cpSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Re-copies the shared static assets into a build output after a turbo cache
 * hit. The cf:build cache scope excludes copied media (img/video/favicon/
 * icons, the brand PDF, terms) to stay under the Workers request body limit,
 * so a restored output needs them back before the deploy upload — and a
 * cache hit implies the inputs (including ../../assets) are unchanged, so
 * re-copying them is byte-identical to what the build would have done.
 *
 * Every entry of the shared assets dir is considered, so new top-level
 * assets are covered without touching this script.
 *
 * Usage: bun scripts/restore-cached-media.mjs <web|app|smashers|docs>
 */
const APPS = {
  web: 'apps/web/dist',
  app: 'apps/app/.output/public',
  smashers: 'apps/smashers/dist/client',
  docs: 'apps/docs/dist',
}

const app = process.argv[2]
const outDir = APPS[app]
if (!outDir) {
  console.error(`[restore-cached-media] unknown app: ${app}`)
  process.exit(1)
}

const target = join(process.cwd(), outDir)
if (!existsSync(target)) {
  // Fresh build output absent: the turbo task ran the real build, nothing to
  // restore.
  console.log('[restore-cached-media] no build output; skipping')
  process.exit(0)
}

const assets = join(process.cwd(), 'assets')
let restored = 0
for (const entry of readdirSync(assets)) {
  const destination = join(target, entry)
  if (existsSync(destination)) continue
  cpSync(join(assets, entry), destination, { recursive: true })
  restored += 1
}

console.log(`[restore-cached-media] ${restored} asset entr(y|ies) restored into ${outDir}`)
