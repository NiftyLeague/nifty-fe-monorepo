import type { APIContext } from 'astro'

import { resolveRedirect } from './redirects.mjs'

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
  const redirect = resolveRedirect(
    {
      pathname: context.url.pathname,
      ...(country ? { country: context.request.headers.get('x-vercel-ip-country') ?? '' } : {}),
      ...(userAgent ? { userAgent: context.request.headers.get('user-agent') ?? '' } : {}),
    },
    {
      APPLE_STORE_ID: import.meta.env.PUBLIC_APPLE_STORE_ID,
      APPLE_STORE_LINK: import.meta.env.PUBLIC_APPLE_STORE_LINK,
      GOOGLE_PLAY: import.meta.env.PUBLIC_GOOGLE_PLAY_LINK,
      EPIC: import.meta.env.PUBLIC_EPIC_LINK,
      STEAM: import.meta.env.PUBLIC_STEAM_LINK,
    }
  )

  if (redirect) return context.redirect(redirect.destination, redirect.status)
  // An unconfigured store link is a deployment gap, not a user-facing route.
  return new Response('Not Found', { status: 404, headers: { 'content-type': 'text/plain' } })
}
