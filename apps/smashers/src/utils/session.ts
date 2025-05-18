// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import { getIronSession } from 'iron-session';
import type { IronSession, SessionOptions } from 'iron-session';
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiHandler,
  NextApiRequest,
  NextApiResponse,
} from 'next';
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

type SessionData = { user?: User };
export type Session = IronSession<SessionData>;

// For API Routes (Pages Router)
export async function getSession(req: NextApiRequest, res: NextApiResponse): Promise<Session> {
  try {
    return await getIronSession<SessionData>(req, res, sessionOptions);
  } catch (error) {
    console.error('Session error:', error);
    throw new Error('Failed to get session');
  }
}

type HandlerWithSession<T = any> = (
  req: NextApiRequest,
  res: NextApiResponse<T>,
  session: Session,
) => unknown | Promise<unknown>;

export function withUserRoute(handler: HandlerWithSession): NextApiHandler {
  return async (req, res) => {
    try {
      const session = await getSession(req, res);
      if (!session.user?.isLoggedIn) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      return handler(req, res, session);
    } catch (error) {
      console.error('Route error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

export function withSessionRoute(handler: HandlerWithSession): NextApiHandler {
  return async (req, res) => {
    try {
      const session = await getSession(req, res);
      return handler(req, res, session);
    } catch (error) {
      console.error('Route error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

export function withSessionSsr<P extends { [key: string]: unknown } = { [key: string]: unknown }>(
  handler: (context: GetServerSidePropsContext & { session: Session }) => Promise<GetServerSidePropsResult<P>>,
) {
  return async (context: GetServerSidePropsContext) => {
    try {
      const { req, res } = context;
      const session = await getSession(req as NextApiRequest, res as NextApiResponse);
      return handler({ ...context, session });
    } catch (error) {
      console.error('SSR error:', error);
      return {
        redirect: { destination: '/500', permanent: false },
      };
    }
  };
}
