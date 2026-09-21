import { readFileSync, renameSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { ASSET_HEADERS } from './headers-content.mjs'

// Nitro emits the Worker entry as a static-ESM module whose import statements
// hoist above the rollup banner, so the inert-DOM shim evaluated too late:
// `@reown/appkit` reads DOM globals at module scope and the hoisted import
// chain hit them first. This script renames the generated entry to _worker.mjs
// and writes a wrapper that installs the shim, then dynamically imports the
// real worker — dynamic imports evaluate only once reached, so the shim runs
// first. Top-level await is supported in module Workers.

const serverDir = join(process.cwd(), '.output', 'server')
const generated = join(serverDir, 'index.mjs')
const renamed = join(serverDir, '_worker.mjs')
renameSync(generated, renamed)

const banner = readFileSync(join(process.cwd(), 'scripts', 'dom-shim.mjs'), 'utf8')

const wrapper = `${banner}

const worker = await import('./_worker.mjs')
export default worker.default
`
writeFileSync(join(serverDir, 'index.mjs'), wrapper)

// Merge the asset cache/CORS policy into the generated `_headers` (Nitro only
// emits the immutable `/assets/*` rule).
const headersTarget = join(process.cwd(), '.output', 'public', '_headers')
let existing = ''
try {
  existing = readFileSync(headersTarget, 'utf8')
  if (!existing.endsWith('\n')) existing += '\n'
} catch {
  // Nitro did not emit one; start fresh.
}
if (!existing.includes('/__images/*')) {
  writeFileSync(headersTarget, existing + ASSET_HEADERS)
}
console.log('[post-build-worker] wrapper entry + asset headers written')
