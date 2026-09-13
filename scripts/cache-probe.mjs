#!/usr/bin/env node
/**
 * Cache-surface probe: re-captures the curl evidence behind
 * `test/contract/cache-surface.test.ts` against a live deployment.
 *
 * For each app it fetches an HTML route (must stay on the revalidating default,
 * never immutable), extracts a hashed-asset URL of the app's immutable class
 * from that HTML (so no content hash is hardcoded), and probes the app's media
 * sample on the refresh policy.
 *
 * Usage:
 *   bun scripts/cache-probe.mjs --app docs --base-url https://docs.niftyleague.com
 *   bun scripts/cache-probe.mjs --app docs --base-url http://localhost:4321   # local preview
 *
 * Exits non-zero when a live header contradicts the declared contract, so it can
 * gate a deploy the same way the contract test gates the configuration.
 */
const IMMUTABLE = 'public, max-age=31536000, immutable'
const REFRESH = 'public, max-age=86400, stale-while-revalidate=604800'

const APPS = {
  docs: {
    htmlPath: '/docs/overview/roadmap',
    hashedPattern: /\/docs\/_astro\/[^"']+\.(?:js|css|woff2|webp|avif)/,
    mediaSamples: [
      { label: 'img', path: '/docs/img/logos/NL/logo.svg' },
      { label: 'favicon', path: '/docs/favicon/nl_purple/favicon.ico' },
    ],
  },
  web: {
    htmlPath: '/',
    hashedPattern: /\/_astro\/[^"']+\.(?:js|css|woff2|webp|avif)/,
    mediaSamples: [{ label: 'img', path: '/img/logos/NL/logo.svg' }],
  },
  smashers: {
    htmlPath: '/',
    hashedPattern: /\/_astro\/[^"']+\.(?:js|css|woff2|webp|avif)/,
    mediaSamples: [],
  },
  app: {
    htmlPath: '/',
    hashedPattern: /\/assets\/[^"']+\.(?:js|css|woff2|webp|avif)/,
    mediaSamples: [],
  },
}

const args = process.argv.slice(2)
const read = (flag) => {
  const value = args[args.indexOf(flag) + 1]
  if (!value) throw new Error(`Missing value for ${flag}`)
  return value
}
const app = read(args.includes('--app') ? '--app' : '')
const baseUrl = read('--base-url').replace(/\/$/, '')
const plan = APPS[app]
if (!plan) {
  console.error(`Unknown app ${app}; expected one of ${Object.keys(APPS).join(', ')}`)
  process.exit(2)
}

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'

const probe = async (path) => {
  const response = await fetch(`${baseUrl}${path}`, { headers: { 'user-agent': UA } })
  return {
    status: response.status,
    cacheControl: response.headers.get('cache-control') ?? '(none)',
    contentType: response.headers.get('content-type') ?? '(none)',
  }
}

let failed = false
const report = (label, path, result, expectation) => {
  const ok = expectation(result)
  if (!ok) failed = true
  console.log(
    `${ok ? 'PASS' : 'FAIL'}  ${label.padEnd(16)} ${path}\n      ${result.status} ${result.contentType}\n      Cache-Control: ${result.cacheControl}`
  )
}

console.log(`Probing ${app} at ${baseUrl}\n`)

const html = await probe(plan.htmlPath)
report(
  'HTML (revalidate)',
  plan.htmlPath,
  html,
  (r) => r.status === 200 && !r.cacheControl.includes('immutable')
)

// Extract a hashed-asset URL from the served HTML itself.
const htmlBody = await (await fetch(`${baseUrl}${plan.htmlPath}`, { headers: { 'user-agent': UA } })).text()
const assetMatch = plan.hashedPattern.exec(htmlBody)
if (!assetMatch) {
  console.log(`FAIL  hashed assets: no ${plan.hashedPattern} URL found in ${plan.htmlPath}`)
  failed = true
} else {
  const assetPath = assetMatch[0]
  const asset = await probe(assetPath)
  report('hashed (immutable)', assetPath, asset, (r) => r.status === 200 && r.cacheControl === IMMUTABLE)
}

for (const sample of plan.mediaSamples) {
  const media = await probe(sample.path)
  report(`media ${sample.label} (refresh)`, sample.path, media, (r) => r.status === 200 && r.cacheControl === REFRESH)
}

console.log(failed ? '\nCache surface does not match the contract.' : '\nCache surface matches the contract.')
process.exit(failed ? 1 : 0)
