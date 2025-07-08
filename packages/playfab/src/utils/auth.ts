import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import AppleProvider from 'next-auth/providers/apple';
import TwitchProvider from 'next-auth/providers/twitch';
import { getServerSession as getServerSessionInternal } from 'next-auth/next';
import type { DefaultSession, NextAuthOptions } from 'next-auth';
import type { DefaultJWT } from 'next-auth/jwt';
import type { User } from '../types';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: string;
    provider?: string;
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    provider?: string;
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID as string,
      clientSecret: process.env.APPLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID as string,
      clientSecret: process.env.TWITCH_CLIENT_SECRET as string,
    }),
  ],
  cookies: {
    pkceCodeVerifier: {
      name: 'next-auth.pkce.code_verifier',
      options: { httpOnly: true, sameSite: 'none', path: '/', secure: true },
    },
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.provider = token.provider;
      return session;
    },
    async signIn() {
      return true;
    },
  },
};

/**
 * Wrapper for getServerSession so that you don't need to import the authOptions in every file.
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerSession = () => getServerSessionInternal(authOptions);
