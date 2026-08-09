/**
 * Live contract smoke test.
 *
 * This layer catches regressions that the hermetic unit suite cannot, such as
 * deployment-topology issues in the Vercel serverless handler. It is skipped
 * by default so `bun test` stays fast and offline. Enable it with
 * `bun run test:live` and point it at any deployment with `BASE_URL`.
 */

import request from 'supertest'
import { describe, expect, it } from 'bun:test'

const BASE_URL = process.env.BASE_URL || 'https://api.niftyleague.com'

const describeLive = process.env.RUN_LIVE_TESTS ? describe : describe.skip

describeLive('Live API contract smoke', () => {
  const agent = request(BASE_URL)

  const expectJsonOk = async (path: string) => {
    const res = await agent.get(path)
    expect(res.status).toBe(200)
    // Supply routes return res.send(string) -> text/html in Express 5;
    // S3-proxied and collection routes return application/json. Both are valid.
    expect(res.header['content-type']).toMatch(/application\/json|text\/html/)
    return res
  }

  it('GET / — returns API contract with endpoints', async () => {
    const res = await expectJsonOk('/')
    expect(res.body.name).toBe('Nifty League Contracts API')
    expect(res.body.version).toBeDefined()
    expect(res.body.endpoints.NFTL).toBeDefined()
    expect(res.body.endpoints.DEGENs).toBeDefined()
    expect(res.body.endpoints.MARKETPLACE).toBeDefined()
  })

  it('GET /NFTL/supply/max — returns a numeric supply string', async () => {
    const res = await expectJsonOk('/NFTL/supply/max')
    expect(Number(BigInt(res.text))).toBeGreaterThan(0)
  })

  it('GET /degens/burn-list — returns an array', async () => {
    const res = await expectJsonOk('/degens/burn-list')
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('GET /imx/marketplace/collection.json — returns collection metadata', async () => {
    const res = await expectJsonOk('/imx/marketplace/collection.json')
    expect(res.body.name).toBeDefined()
    expect(res.body.external_link).toBe('https://niftyleague.com')
  })

  it('GET /sepolia/degen/metadata/1 — returns degen metadata JSON', async () => {
    const res = await expectJsonOk('/sepolia/degen/metadata/1')
    expect(res.body.name).toBeDefined()
  })

  it('GET /imx/marketplace/metadata/1 — returns marketplace metadata JSON', async () => {
    const res = await expectJsonOk('/imx/marketplace/metadata/1')
    expect(res.body.name).toBeDefined()
  })
})

export {}
