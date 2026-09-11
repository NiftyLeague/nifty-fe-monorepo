import { getIronSession } from 'iron-session'
import type { IronSession, SessionOptions } from 'iron-session'
import type { User } from '@nl/playfab/types'

import type { APIContext } from 'astro'

export const SESSION_TIMEOUT = {
  remember: 60 * 60 * 24 * 30, // 30 days for "remember me"
  default: 60 * 60 * 8, // 8 hours for regular sessions
}

/**
 * The session secret is read lazily so the module can be imported by tests and
 * by the OAuth flow helpers without a build-time environment assertion.
 */
const getSessionSecret = (): string => {
  const secret = process.env.SESSION_SECRET ?? process.env.NEXTAUTH_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('Missing or invalid SESSION_SECRET (needs 32+ chars)')
  }
  return secret
}

const isSecureDeployment = (): boolean =>
  process.env.PUBLIC_DEPLOY_ENV === 'production' ||
  process.env.VERCEL_ENV === 'production' ||
  process.env.VERCEL_ENV === 'preview'

export const getSessionOptions = (): SessionOptions => ({
  password: getSessionSecret(),
  cookieName: 'iron_session_playfab',
  cookieOptions: {
    secure: isSecureDeployment(),
    sameSite: 'lax',
    httpOnly: true,
    maxAge: SESSION_TIMEOUT.remember,
  },
})

type ISODateString = string
export type SessionData = { user?: User; expires: ISODateString }
export type Session = IronSession<SessionData>

/**
 * iron-session's CookieStore contract is deliberately the shape Astro's cookie
 * jar exposes: `get` for reads and `set(name, value, options)` for writes.
 */
export async function getSession(context: APIContext): Promise<Session> {
  const { cookies } = context
  return getIronSession<SessionData>(
    {
      get: (name) => {
        const cookie = cookies.get(name)
        return cookie ? { name, value: cookie.value } : undefined
      },
      // Astro's `set` returns void where iron-session's contract returns
      // unknown, and Astro rejects a numeric `expires` where iron-session allows
      // one. Both are narrowed rather than papered over with a cast.
      set: (name, value, options) => {
        const { expires, ...rest } = options
        cookies.set(name, value, {
          ...rest,
          ...(expires instanceof Date ? { expires } : {}),
        })
      },
    },
    getSessionOptions()
  )
}

/** JSON response helper, replacing `NextResponse.json`. */
export const json = (data: unknown, init?: ResponseInit): Response =>
  new Response(JSON.stringify(data), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
