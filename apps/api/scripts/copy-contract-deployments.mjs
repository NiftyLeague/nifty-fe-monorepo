// Bundle the shared contract registries into the API function.
//
// The API imports small local wrappers so TypeScript keeps one canonical source
// in @nl/contracts. Vercel cannot follow the workspace symlink to that source
// from the deployed function, so compile the two data-only modules into the
// API's own dist tree before copy-api-app.mjs assembles the function bundle.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = resolve(root, '..', '..', 'packages', 'contracts', 'src', 'deployments')
const destinationRoot = resolve(root, 'dist', 'src', 'contracts', 'deployments')
const bun = process.env.BUN_BINARY || 'bun'

mkdirSync(destinationRoot, { recursive: true })

for (const name of ['mainnet', 'sepolia']) {
  const source = resolve(sourceRoot, `${name}.ts`)
  const destination = resolve(destinationRoot, `${name}.js`)

  if (!existsSync(source)) {
    throw new Error(`[copy-contract-deployments] source not found: ${source}`)
  }

  execFileSync(
    bun,
    ['build', source, '--outfile', destination, '--format', 'esm', '--target', 'node'],
    { cwd: root, stdio: 'inherit' }
  )
  console.log(`[copy-contract-deployments] bundled ${source} -> ${destination}`)
}
