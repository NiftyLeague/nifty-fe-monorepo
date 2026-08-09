#!/usr/bin/env node
/**
 * audit-endpoints — live contract audit for the Nifty League Contracts API.
 *
 * Hits every public route on a deployed API and exits non-zero if any route
 * deviates from its contract. This is the gate an AI agent runs after a
 * dependency bump or deploy to prove "no API functionality lost".
 *
 * Usage:
 *   node scripts/audit-endpoints.mjs [BASE_URL]
 *   BASE_URL=https://api.niftyleague.com node scripts/audit-endpoints.mjs
 *
 * Env:
 *   BASE_URL   Target deployment (default: https://api.niftyleague.com)
 *   AUDIT_NETWORK  Network segment for token routes (default: sepolia)
 */

const BASE_URL = process.argv[2] || process.env.BASE_URL || 'https://api.niftyleague.com'
const NETWORK = process.env.AUDIT_NETWORK || 'sepolia'

// Each check: path -> { status, contentType, validator }
const checks = [
  {
    name: 'GET /',
    path: '/',
    status: 200,
    contentType: /application\/json/,
    validate: (body) =>
      body.name === 'Nifty League Contracts API' &&
      !!body.version &&
      !!body.endpoints?.NFTL &&
      !!body.endpoints?.DEGENs &&
      !!body.endpoints?.MARKETPLACE,
  },
  {
    name: 'GET /NFTL/supply/max',
    path: '/NFTL/supply/max',
    status: 200,
    // res.send(string) yields text/html in Express 5 — that is the actual
    // production contract for these supply routes (see src/index.integration.test.ts).
    contentType: /text\/html|text\/plain|application\/json/,
    validate: (body, text) => {
      const v = text ?? body
      try {
        return BigInt(String(v).trim()) > 0n
      } catch {
        return false
      }
    },
  },
  {
    name: 'GET /degens/burn-list',
    path: '/degens/burn-list',
    status: 200,
    contentType: /application\/json/,
    validate: (body) => Array.isArray(body),
  },
  {
    name: 'GET /imx/marketplace/collection.json',
    path: '/imx/marketplace/collection.json',
    status: 200,
    contentType: /application\/json/,
    validate: (body) => body.name && body.external_link === 'https://niftyleague.com',
  },
  {
    name: `GET /${NETWORK}/degen/metadata/1`,
    path: `/${NETWORK}/degen/metadata/1`,
    status: 200,
    contentType: /application\/json/,
    validate: (body) => !!body.name,
  },
  {
    name: 'GET /imx/marketplace/metadata/1',
    path: '/imx/marketplace/metadata/1',
    status: 200,
    contentType: /application\/json/,
    validate: (body) => !!body.name,
  },
]

async function runCheck(check) {
  const res = await fetch(`${BASE_URL}${check.path}`, { redirect: 'follow' })
  const contentType = res.headers.get('content-type') || ''
  const text = await res.text()
  let body = text
  if (contentType.includes('application/json')) {
    try {
      body = JSON.parse(text)
    } catch {
      /* leave as text */
    }
  }

  const failures = []
  if (res.status !== check.status) failures.push(`status ${res.status} != ${check.status}`)
  if (check.contentType && !check.contentType.test(contentType))
    failures.push(`content-type "${contentType}" !~ ${check.contentType}`)
  if (failures.length === 0 && !check.validate(body, text))
    failures.push('body did not satisfy contract')

  return { check, ok: failures.length === 0, failures, status: res.status, contentType }
}

async function main() {
  console.log(`Auditing ${BASE_URL}\n`)
  let failed = 0
  for (const check of checks) {
    try {
      const r = await runCheck(check)
      if (r.ok) {
        console.log(`  ✓ ${r.check.name} — ${r.status} ${r.contentType.split(';')[0]}`)
      } else {
        failed++
        console.log(`  ✗ ${r.check.name} — ${r.failures.join('; ')}`)
      }
    } catch (e) {
      failed++
      console.log(`  ✗ ${check.name} — request error: ${e.message}`)
    }
  }

  console.log(`\n${checks.length - failed}/${checks.length} endpoints passed.`)
  if (failed > 0) {
    console.error(`\nAUDIT FAILED: ${failed} endpoint(s) deviated from contract.`)
    process.exit(1)
  }
  console.log('AUDIT PASSED: all endpoints match contract.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
