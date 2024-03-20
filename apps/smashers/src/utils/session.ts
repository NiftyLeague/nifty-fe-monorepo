// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import type { IronSessionOptions } from 'iron-session';
import type { User } from '@/lib/playfab/types';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler } from 'next';

export const sessionOptions: IronSessionOptions = {
  password: process.env.NEXTAUTH_SECRET as string,
  cookieName: 'iron-session/playfab',
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

// This is where we specify the typings of req.session.*
declare module 'iron-session' {
  interface IronSessionData {
    user?: User;
  }
}

export function withSessionRoute(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

const withUserHandler = (handler: NextApiHandler): NextApiHandler => {
  return async function nextApiHandlerWrappedWithUser(req, res) {
    const user = req.session.user;
    if (!user || user.isLoggedIn === false) {
      res.status(401).end();
      return;
    }

    return handler(req, res);
  };
};

export function withUserRoute(handler: NextApiHandler) {
  return withSessionRoute(withUserHandler(handler));
}

// Theses types are compatible with InferGetStaticPropsType https://nextjs.org/docs/basic-features/data-fetching#typescript-use-getstaticprops
export function withSessionSsr<P extends { [key: string]: unknown } = { [key: string]: unknown }>(
  handler: (context: GetServerSidePropsContext) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
  return withIronSessionSsr(handler, sessionOptions);
}
