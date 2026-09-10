import { routeRequest } from './routes.mjs'
import LEGGIES from '../.web-images/leggies.json'

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> }
  DEPLOY_ENV?: 'production' | 'preview' | 'development'
}
interface RewriterElement {
  setAttribute(name: string, value: string): void
}
declare const HTMLRewriter: {
  new (): {
    on(
      selector: string,
      handler: { element(element: RewriterElement): void }
    ): {
      transform(response: Response): Response
    }
  }
}

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}

async function shell(request: Request, env: Env, asset: string) {
  const url = new URL(asset, request.url)
  const response = await env.ASSETS.fetch(new Request(url, { method: 'GET' }))
  if (!response.ok) return new Response('Site shell unavailable', { status: 503 })
  const headers = new Headers(response.headers)
  headers.delete('Content-Length')
  headers.delete('ETag')
  headers.set('Content-Type', 'text/html; charset=utf-8')
  for (const [name, value] of Object.entries(securityHeaders)) headers.set(name, value)
  // OpenSea embeds GLTF in a sandbox with an opaque origin.
  headers.delete('X-Frame-Options')
  headers.delete('Content-Security-Policy')
  return new Response(response.body, { status: 200, headers })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const plan = routeRequest(request.url, env.DEPLOY_ENV ?? 'production')
    if (plan.kind === 'redirect') return Response.redirect(plan.url, plan.status)

    if (plan.kind === 'proxy') {
      try {
        // Preserve method/body/cookies, including cart POSTs. Do not follow a
        // checkout or login redirect server-side or cache personal responses.
        const forwarded = new Request(plan.url, request)
        forwarded.headers.delete('Host')
        const upstream = await fetch(new Request(forwarded, { redirect: 'manual' }))
        return upstream
      } catch {
        return new Response('Upstream temporarily unavailable', {
          status: 502,
          headers: securityHeaders,
        })
      }
    }

    if (plan.kind === 'gltf' || plan.kind === 'referral') {
      if (!['GET', 'HEAD'].includes(request.method))
        return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } })
      const response = await shell(request, env, plan.asset)
      if (!response.ok) return response
      if (plan.kind === 'referral') {
        response.headers.set('Cache-Control', 'no-store')
        response.headers.set('X-Robots-Tag', 'noindex, nofollow')
        return request.method === 'HEAD' ? new Response(null, response) : response
      }
      const extension = LEGGIES.includes(Number(plan.tokenId)) ? 'gif' : 'webp'
      const poster = `/img/degens/nfts/${plan.tokenId}.${extension}`
      response.headers.set('Cache-Control', 'public, max-age=0, s-maxage=3600')
      // Token ID is validated as digits and written through attribute APIs, not
      // interpolated into executable JS or Astro's serialized hydration props.
      const transformed = new HTMLRewriter()
        .on('[data-gltf-poster]', {
          element(element) {
            element.setAttribute('src', poster)
          },
        })
        .transform(response)
      return request.method === 'HEAD' ? new Response(null, transformed) : transformed
    }

    if (plan.kind === 'not-found') {
      const response = await env.ASSETS.fetch(new Request(new URL('/404.html', request.url)))
      return new Response(request.method === 'HEAD' ? null : response.body, {
        status: 404,
        headers: response.headers,
      })
    }
    return env.ASSETS.fetch(request)
  },
}
