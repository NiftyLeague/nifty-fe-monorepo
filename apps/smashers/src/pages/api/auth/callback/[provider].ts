import type { APIContext, APIRoute } from 'astro'

import { LinkProvider } from '@nl/playfab/api/client'
import { exchangeCodeForTokens, getLinkCredential, getOAuthProvider } from '@nl/playfab/auth/oauth'
import { OAUTH_FLOW_COOKIE, statesMatch, unsealFlowState } from '@nl/playfab/auth/flow'

import { clearFlowCookie, getAuthSecret, getCallbackUrl, getSession, json } from '@/utils/oauth'

/**
 * Reads the provider's authorization response. Apple returns a form POST with
 * `response_mode=form_post`; every other provider returns query parameters on a
 * GET. Both shapes are normalized here.
 */
const readCallbackParams = async (context: APIContext) => {
  const query = context.url.searchParams
  if (context.request.method !== 'POST') {
    return {
      code: query.get('code'),
      state: query.get('state'),
      error: query.get('error'),
      errorDescription: query.get('error_description'),
    }
  }

  const form = await context.request.formData().catch(() => new FormData())
  const value = (name: string) => {
    const entry = form.get(name)
    return typeof entry === 'string' ? entry : null
  }
  return {
    code: value('code'),
    state: value('state'),
    error: value('error'),
    errorDescription: value('error_description'),
  }
}

const finish = (context: APIContext, destination: string): Response => {
  clearFlowCookie(context)
  return context.redirect(destination, 302)
}

const handle = async (context: APIContext): Promise<Response> => {
  const provider = context.params.provider
  if (!provider) return json({ message: 'Missing provider' }, { status: 400 })

  const config = getOAuthProvider(provider)
  if (!config) return json({ message: `Unknown provider: ${provider}` }, { status: 400 })

  const { code, state, error, errorDescription } = await readCallbackParams(context)
  if (error) return json({ message: errorDescription ?? error }, { status: 400 })
  if (!code) return json({ message: 'Missing authorization code' }, { status: 400 })

  const flow = await unsealFlowState(
    context.cookies.get(OAUTH_FLOW_COOKIE)?.value,
    getAuthSecret(),
    config.id
  )
  // No valid flow cookie means the callback cannot be tied to a sign-in this
  // browser started, so it is rejected rather than treated as an implicit flow.
  if (!flow) return json({ message: 'Invalid or expired sign-in attempt' }, { status: 400 })
  if (!statesMatch(flow.state, state)) {
    return json({ message: 'Invalid state parameter' }, { status: 400 })
  }

  const session = await getSession(context)
  const isLinking = Boolean(session.user?.isLoggedIn)

  const clientId = process.env[config.clientIdEnv] ?? ''
  const clientSecret = process.env[config.clientSecretEnv] ?? ''
  if (!clientId || !clientSecret) {
    return json({ message: `Provider ${provider} is not configured` }, { status: 500 })
  }

  let tokens
  try {
    tokens = await exchangeCodeForTokens({
      config,
      clientId,
      clientSecret,
      code,
      redirectUri: getCallbackUrl(context, config.id),
      verifier: flow.verifier,
    })
  } catch (exchangeError) {
    console.error('OAuth code exchange failed', exchangeError)
    return finish(context, '/login?error=oauth')
  }

  const credential = getLinkCredential(config, tokens)
  // Without a PlayFab session there is no account to link the provider to. The
  // provider still authenticated the visitor, but PlayFab owns identity here, so
  // the honest outcome is to send them through the email login.
  if (!credential || !isLinking || !session.user?.SessionTicket) {
    return finish(context, '/login?error=link-required')
  }

  try {
    await LinkProvider(config.id, credential, session.user.SessionTicket)
  } catch (linkError) {
    console.error('Provider link failed', linkError)
    return finish(context, '/profile?error=link-failed')
  }

  return finish(context, flow.callbackUrl)
}

export const GET: APIRoute = (context) => handle(context)
export const POST: APIRoute = (context) => handle(context)
