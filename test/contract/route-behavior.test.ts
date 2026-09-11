import { describe, expect, it } from 'bun:test'

/**
 * Behavioral guard for externally-consumed API handlers.
 *
 * File-existence (see route-surface.test.ts) proves a route file exists; this
 * proves the handler still behaves correctly — e.g. that edge-geo still returns
 * the user's geolocation for the Unity games on niftysmasher.com. If someone
 * refactors the handler and drops the geolocation read, this test fails.
 *
 * smashers ships as Astro SSR: the handler reads the Vercel `x-vercel-ip-*`
 * headers directly, which is what `@vercel/edge`'s `geolocation()` wrapped, so
 * the request is built with those headers instead of mocking the package.
 */
const loadEdgeGeo = async () => import('../../apps/smashers/src/pages/api/edge-geo')

const callGet = async (headers: Record<string, string> = {}) => {
  const { GET } = await loadEdgeGeo()
  const request = new Request('https://niftysmashers.com/api/edge-geo', { headers })
  return GET({ request } as Parameters<typeof GET>[0])
}

describe('edge-geo route behavior', () => {
  it('returns the geolocated city and country for a request', async () => {
    const response = await callGet({
      'x-vercel-ip-country': 'US',
      'x-vercel-ip-city': 'New York',
    })

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe('text/html')
    const body = await response.text()
    expect(body).toContain('US')
    expect(body).toContain('New York')
  })

  it('handles a request without geolocation headers', async () => {
    const response = await callGet()

    expect(response.status).toBe(200)
    expect(await response.text()).toContain('Your location is')
  })
})
