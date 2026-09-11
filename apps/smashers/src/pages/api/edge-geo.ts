import type { APIRoute } from 'astro'

/**
 * Reports the caller's geolocation to the Unity games.
 *
 * The Next.js version read this through `@vercel/edge`'s `geolocation(request)`,
 * which is a thin wrapper over the `x-vercel-ip-*` request headers that the
 * Vercel platform injects. Reading those headers directly drops the dependency
 * and keeps the response identical.
 */
export const GET: APIRoute = ({ request }) => {
  const city = request.headers.get('x-vercel-ip-city') ?? ''
  const country = request.headers.get('x-vercel-ip-country') ?? ''

  return new Response(`<h1>Your location is ${city}, ${country}</h1>`, {
    headers: { 'content-type': 'text/html' },
  })
}
