// Place the compiled application inside api/ so Vercel's Git function tracer
// follows it as a sibling of the serverless entry point.
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = resolve(root, 'dist', 'src')
const destination = resolve(root, 'api', '.app')

if (!existsSync(source)) {
  throw new Error(`[copy-api-app] compiled source not found: ${source}`)
}

rmSync(destination, { force: true, recursive: true })
mkdirSync(destination, { recursive: true })
cpSync(source, destination, { recursive: true })
console.log(`[copy-api-app] copied ${source} -> ${destination}`)
