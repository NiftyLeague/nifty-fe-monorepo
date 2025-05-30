import { getIronSession } from 'iron-session';
import { NextResponse } from 'next/server';
import { cookies as nextCookies } from 'next/headers';
import type { IronSession, SessionOptions } from 'iron-session';
import type { User } from '@nl/playfab/types';

const SESSION_SECRET = process.env.NEXTAUTH_SECRET;
if (!SESSION_SECRET || SESSION_SECRET.length < 32) {
  throw new Error('Missing or invalid NEXTAUTH_SECRET (needs 32+ chars)');
}

export const SESSION_TIMEOUT = {
  remember: 60 * 60 * 24 * 30, // 30 days for "remember me"
  default: 60 * 60 * 8, // 8 hours for regular sessions
};

export const sessionOptions: SessionOptions = {
  password: SESSION_SECRET,
  cookieName: 'iron_session_playfab',
  cookieOptions: {
    secure: process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview',
    sameSite: 'lax',
    httpOnly: true,
    maxAge: SESSION_TIMEOUT.remember,
  },
};

type ISODateString = string;
type SessionData = { user?: User; expires: ISODateString };
export type Session = IronSession<SessionData>;

// App Router session helper
export async function getSession(): Promise<Session> {
  const cookies = await nextCookies();
  return getIronSession(cookies, sessionOptions);
}

// DRY session route wrapper for App Router
export function withSessionRoute(handler: (request: Request, session: Session) => Promise<Response> | Response) {
  return async function (request: Request) {
    const session = await getSession();
    const response = await handler(request, session);
    if (typeof session.save === 'function') {
      const setCookies = await session.save();
      if (Array.isArray(setCookies) && setCookies.length > 0) {
        if (response instanceof NextResponse) {
          setCookies.forEach((cookie: string) => {
            response.headers.append('Set-Cookie', cookie);
          });
        } else {
          const newHeaders = new Headers(response.headers);
          setCookies.forEach((cookie: string) => {
            newHeaders.append('Set-Cookie', cookie);
          });
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
          });
        }
      }
    }
    return response;
  };
}

// Require user to be logged in for route access (App Router)
export function withUserRoute(handler: (request: Request, session: Session) => Promise<Response> | Response) {
  return withSessionRoute(async (request, session) => {
    if (!session.user?.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return handler(request, session);
  });
}
