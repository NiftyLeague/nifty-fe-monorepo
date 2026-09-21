import type { APIRoute } from 'astro'

/**
 * Reports the caller's geolocation to the Unity games.
 *
 * The platform injects the geo object on the Workers request (`request.cf`).
 *
 * The response is per-caller (it varies on platform-injected geo headers), so
 * it is pinned `no-store` rather than left on the platform default, which is
 * `public` and invites shared-cache reuse of a per-geo answer. Edge caching it
 * would also require a `Vary` on the caller's address.
 */
export const GET: APIRoute = ({ request }) => {
  const cf = (request as Request & { cf?: { city?: string; country?: string } }).cf
  const city = cf?.city ?? ''
  const country = cf?.country ?? ''

  return new Response(`<h1>Your location is ${city}, ${country}</h1>`, {
    headers: {
      'content-type': 'text/html',
      'cache-control': 'no-store',
    },
  })
}
