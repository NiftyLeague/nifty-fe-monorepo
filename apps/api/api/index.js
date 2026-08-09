// Vercel serverless entry point.
//
// This is intentionally a plain .js file that re-exports the pre-built
// application from `dist/`. The build command (`bun run build`) compiles the
// TypeScript sources with `tsc` + `tsc-alias`, which rewrites the `@/*` path
// aliases to relative paths and appends the `.js` extensions that Node's ESM
// loader requires. Importing the compiled output here avoids having the
// @vercel/node builder recompile raw TypeScript (which does not run tsc-alias
// and therefore produces extensionless/aliased imports that crash at runtime
// with ERR_MODULE_NOT_FOUND).
//
import { fileURLToPath } from 'node:url'

globalThis.process.env.NODE_CONFIG_TS_DIR ??= fileURLToPath(new URL('./config/', import.meta.url))

const { default: app } = await import('./.app/index.js')

export default app
