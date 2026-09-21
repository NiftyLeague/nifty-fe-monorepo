// Copies config/ next to the compiled output and serverless app as a traced,
// importable asset.
//
// Why: `node-config-ts` reads config/default.json from disk at runtime (fs,
// not import), so bundlers that only trace filesystem reads never include it
// and the build crashes
// with `config.imx is undefined`. A traced `import` of the JSON (see
// src/config.ts) makes the bundler include dist/config/default.json in
// the deployed bundle.
import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = resolve(root, 'config')
const destinations = [resolve(root, 'dist', 'config'), resolve(root, 'api', 'config')]

if (!existsSync(src)) {
  console.warn('[copy-config] config/ not found, skipping')
  process.exit(0)
}

for (const dest of destinations) {
  mkdirSync(dirname(dest), { recursive: true })
  cpSync(src, dest, { recursive: true })
  console.log(`[copy-config] copied ${src} -> ${dest}`)
}
