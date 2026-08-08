import { describe, expect, it } from 'bun:test'
import { mock } from 'bun:test'

/**
 * Behavioral guard for externally-consumed API handlers.
 *
 * File-existence (see route-surface.test.ts) proves a route file exists; this
 * proves the handler still behaves correctly — e.g. that edge-geo still returns
 * the user's geolocation for the Unity games on niftysmasher.com. If someone
 * refactors the handler and drops the geolocation call, this test fails.
 */

describe('edge-geo route behavior', () => {
  it('returns the geolocated city and country for a request', async () => {
    mock.module('@vercel/edge', () => ({
      geolocation: (request: Request) => {
        const country = request.headers.get('x-vercel-ip-country') ?? ''
        const city = request.headers.get('x-vercel-ip-city') ?? ''
        return { city, country }
      },
    }))

    const { GET } = await import('../../apps/smashers/src/app/(auth_routes)/api/edge-geo/route')

    const request = new Request('https://niftysmashers.com/api/edge-geo', {
      headers: { 'x-vercel-ip-country': 'US', 'x-vercel-ip-city': 'New York' },
    })
    const response = await GET(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe('text/html')
    const body = await response.text()
    expect(body).toContain('US')
    expect(body).toContain('New York')
  })

  it('handles a request without geolocation headers', async () => {
    mock.module('@vercel/edge', () => ({
      geolocation: () => ({ city: '', country: '' }),
    }))

    const { GET } = await import('../../apps/smashers/src/app/(auth_routes)/api/edge-geo/route')

    const request = new Request('https://niftysmashers.com/api/edge-geo')
    const response = await GET(request)

    expect(response.status).toBe(200)
    expect(await response.text()).toContain('Your location is')
  })
})
