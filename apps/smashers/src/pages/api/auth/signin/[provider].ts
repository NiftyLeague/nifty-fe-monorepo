import type { APIRoute } from 'astro'

import { clearFlowCookie, json, resolveCallbackUrl, startOAuthFlow } from '@/utils/oauth'

/**
 * GET /api/auth/signin/:provider?callbackUrl=/profile
 *
 * Replaces the next-auth `signIn()` entry point. The response is a redirect to
 * the provider so the browser can complete the consent screen.
 *
 * Anyone, signed in or not, may start a flow: the callback decides what the
 * result means, and it links only when a PlayFab session is present. Starting
 * the flow up front means an expired PlayFab cookie is discovered at the
 * callback with the provider already consenting, rather than being guessed at
 * here.
 */
export const GET: APIRoute = async (context) => {
  const provider = context.params.provider
  if (!provider) return json({ message: 'Missing provider' }, { status: 400 })

  const callbackUrl = resolveCallbackUrl(context.url.searchParams.get('callbackUrl'))

  const flow = await startOAuthFlow(context, provider, callbackUrl)
  if ('error' in flow) {
    clearFlowCookie(context)
    return json({ message: flow.error }, { status: 400 })
  }

  return context.redirect(flow.redirect, 302)
}
