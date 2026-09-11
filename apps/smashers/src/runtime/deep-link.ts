import type { APIContext } from 'astro'

import { resolveRedirect } from './redirects.mjs'
import { getStoreLinks } from './store-links'

/**
 * Shared adapter that turns the pure deep-link resolver into a route response.
 *
 * These paths have no page of their own: they exist to forward to an app store
 * or to the marketing site. They are real route files rather than middleware
 * because Astro resolves routing before middleware runs, so an unmatched path
 * would 404 without ever reaching a middleware redirect.
 */
export const deepLinkResponse = (
  context: APIContext,
  { country = false, userAgent = false }: { country?: boolean; userAgent?: boolean } = {}
): Response => {
  const links = getStoreLinks()

  const redirect = resolveRedirect(
    {
      pathname: context.url.pathname,
      ...(country ? { country: context.request.headers.get('x-vercel-ip-country') ?? '' } : {}),
      ...(userAgent ? { userAgent: context.request.headers.get('user-agent') ?? '' } : {}),
    },
    {
      APPLE_STORE_ID: links.appleStoreId,
      APPLE_STORE_LINK: links.appleStoreLink,
      GOOGLE_PLAY: links.googlePlayLink,
      EPIC: links.epicLink,
      STEAM: links.steamLink,
    }
  )

  if (redirect) return context.redirect(redirect.destination, redirect.status)

  // An unconfigured store link is a deployment gap, not a user-facing route.
  // Surface it loudly: a silent 404 here previously sent store traffic nowhere.
  const missing = Object.entries(links)
    .filter(([, value]) => !value)
    .map(([name]) => name)
  console.error(`[deep-link] no destination configured for ${context.url.pathname}`, { missing })

  return new Response('Not Found', { status: 404, headers: { 'content-type': 'text/plain' } })
}
