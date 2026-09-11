import { defineMiddleware } from 'astro:middleware'

import { resolveRedirect } from './runtime/redirects.mjs'

const REDIRECT_SOURCES = ['/ios', '/android', '/epic', '/steam', '/invite/']

/**
 * Store deep links and referral redirects are resolved here rather than in a
 * build-time config file, so destinations can differ per environment (production
 * vs preview) without a rebuild.
 *
 * Headers are read only for the paths that can actually redirect: touching
 * `request.headers` on a prerendered route emits a build warning.
 */
export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url
  if (!REDIRECT_SOURCES.some((source) => pathname.startsWith(source))) return next()

  const redirect = resolveRedirect(
    {
      pathname,
      country: context.request.headers.get('x-vercel-ip-country') ?? '',
      userAgent: context.request.headers.get('user-agent') ?? '',
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
  return next()
})
