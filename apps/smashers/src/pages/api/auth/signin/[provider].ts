import type { APIRoute } from 'astro'

import {
  clearFlowCookie,
  getSession,
  json,
  resolveCallbackUrl,
  startOAuthFlow,
} from '@/utils/oauth'

/**
 * GET /api/auth/signin/:provider?callbackUrl=/profile
 *
 * Replaces the next-auth `signIn()` entry point. The response is a redirect to
 * the provider so the browser can complete the consent screen.
 */
export const GET: APIRoute = async (context) => {
  const provider = context.params.provider
  if (!provider) return json({ message: 'Missing provider' }, { status: 400 })

  const callbackUrl = resolveCallbackUrl(context.url.searchParams.get('callbackUrl'))

  // A signed-in PlayFab user is linking a provider; anyone else is signing in.
  // Linking without a PlayFab session would leave an orphaned OAuth session, so
  // send those visitors to the login page to establish the PlayFab session first.
  const session = await getSession(context)
  const isLinking = Boolean(session.user?.isLoggedIn)
  if (!isLinking && callbackUrl.includes('#')) {
    return context.redirect(resolveCallbackUrl(null, '/login'), 302)
  }

  const flow = await startOAuthFlow(context, provider, callbackUrl)
  if ('error' in flow) {
    clearFlowCookie(context)
    return json({ message: flow.error }, { status: 400 })
  }

  return context.redirect(flow.redirect, 302)
}
