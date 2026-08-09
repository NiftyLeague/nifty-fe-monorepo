// Vercel build + config injection.
//
// `vercel build` (Build Output API) assembles the function bundle by tracing
// imports from the entry point. `node-config-ts` loads `config/default.json`
// from disk at runtime (not via import), so the tracer never includes it and
// the function crashes with `config.imx is undefined` in production.
//
// `vercel.json`'s `functions.includeFiles` is ALSO ignored in Build Output API
// mode, so we inject the config into the prebuilt function bundle ourselves:
//   1. bun run build     -> dist/ (+ dist/config and api/config via copy-config.mjs)
//   2. vercel build      -> .vercel/output/functions/api/index.func/
//   3. copy config/ + dist/config into that function bundle
//
// The function reads it via NODE_CONFIG_TS_DIR=api/config (set in api/index.js).
import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const scope = process.env.VERCEL_SCOPE || 'niftyleague'
const isProd = process.argv.includes('--prod')

// Fail loudly with the exact cause so a broken server-side Vercel build
// surfaces the underlying error instead of a generic "build may have failed".
const run = (cmd, label) => {
  console.log(`[vercel-build] ${cmd}`)
  try {
    execSync(cmd, { stdio: 'inherit', cwd: root })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`\n[vercel-build] ✗ FAILED: ${label}`)
    console.error(`[vercel-build]   command : ${cmd}`)
    console.error(`[vercel-build]   cause   : ${message}`)
    fail(message)
  }
}

// Persist a build manifest so a future auto-deploy from Git can be inspected
// after the fact (handy when revisiting Git auto-deploy).
const manifest = { startedAt: new Date().toISOString(), isProd, scope, steps: [] }
const recordStep = (name, ok, detail) => {
  manifest.steps.push({ name, ok, detail, at: new Date().toISOString() })
}

function fail(reason) {
  const summary = {
    ok: false,
    reason,
    steps: manifest.steps,
  }
  try {
    writeFileSync(resolve(root, '.vercel-build-failure.json'), JSON.stringify(summary, null, 2))
    console.error(`[vercel-build] wrote failure manifest -> .vercel-build-failure.json`)
  } catch {
    /* best-effort */
  }
  console.error(`\n[vercel-build] ✗ build aborted: ${reason}`)
  process.exit(1)
}

try {
  // 1. Compile sources (+ dist/config).
  run('bun run build', 'compile sources (bun run build)')
  recordStep('build', true)

  // 2. Build the Vercel output.
  // On Vercel's build server the project context is provided via env vars
  // (VERCEL_PROJECT_ID / VERCEL_ORG_ID / VERCEL_TOKEN), so `vercel build` needs
  // NO --scope — passing one can conflict with that context and fail. Locally we
  // `vercel pull` first (creates .vercel/project.json) so the unscoped build
  // works too. If a token is present (CI / Vercel build env) we forward it.
  const token = process.env.VERCEL_TOKEN
  const authFlag = token ? ` --token ${token}` : ''
  if (!existsSync(resolve(root, '.vercel', 'project.json'))) {
    run(`npx vercel pull --yes --scope ${scope}`, 'vercel pull (project context)')
  }
  run(`npx vercel build${isProd ? ' --prod' : ''}${authFlag}`, 'vercel build')
  recordStep('vercel-build', true)

  // 3. Inject config + dist into the function bundle.
  // `vercel build` traces imports, so `dist/` is normally included — but we copy
  // it explicitly as a safety net (the Git build on Vercel's servers has been
  // observed to omit it, causing `Cannot find module dist/src/index.js`). Same
  // for config/, which is loaded from disk at runtime and never traced.
  const funcDir = resolve(root, '.vercel', 'output', 'functions', 'api', 'index.func')
  if (!existsSync(funcDir)) {
    fail(
      `Function bundle not found at ${funcDir}; vercel build did not produce the expected output.`
    )
  }

  const copies = [
    { from: resolve(root, 'config'), to: resolve(funcDir, 'config') },
    { from: resolve(root, 'config'), to: resolve(funcDir, 'dist', 'config') },
    { from: resolve(root, 'config'), to: resolve(funcDir, 'api', 'config') },
    { from: resolve(root, 'dist'), to: resolve(funcDir, 'dist') },
  ]
  for (const { from, to } of copies) {
    if (!existsSync(from)) continue
    mkdirSync(dirname(to), { recursive: true })
    cpSync(from, to, { recursive: true })
    console.log(`[vercel-build] injected -> ${to}`)
  }

  // 4. Ensure the runtime env var that points node-config-ts at the bundled
  // config reaches the function, and make the bundle deployable.
  //
  // - NODE_CONFIG_TS_DIR: vercel.json `env` and project-level env vars get
  //   dropped because `vercel build` emits `.vc-config.json` with an empty
  //   `environment`, so we write it directly — the one place guaranteed to
  //   apply at runtime.
  // filePathsMap: `vercel build` traces pnpm's symlinked `.pnpm` store
  //   and lists those symlink paths as packaging sources. Vercel's deploy
  //   rejects symlinked sources ("invalid deployment package … symlinked
  //   directories"). The func bundle already has a real (non-symlinked)
  //   node_modules installed, so dropping the map lets Vercel package the
  //   func dir contents as-is.
  const vcConfigPath = resolve(funcDir, '.vc-config.json')
  if (existsSync(vcConfigPath)) {
    const vc = JSON.parse(readFileSync(vcConfigPath, 'utf8'))
    vc.environment = { ...(vc.environment || {}), NODE_CONFIG_TS_DIR: 'api/config' }
    delete vc.filePathMap
    writeFileSync(vcConfigPath, JSON.stringify(vc, null, 2))
    console.log('[vercel-build] patched .vc-config.json (env + filePathsMap)')
  }

  recordStep('inject-config', true)

  writeFileSync(
    resolve(root, '.vercel-build-success.json'),
    JSON.stringify({ ok: true, steps: manifest.steps }, null, 2)
  )
  console.log(
    '[vercel-build] done. Deploy with: npx vercel deploy --prebuilt --prod --scope ' + scope
  )
} catch (err) {
  // Any unexpected throw (not from `run`) still ends up here.
  fail(err instanceof Error ? err.message : String(err))
}
