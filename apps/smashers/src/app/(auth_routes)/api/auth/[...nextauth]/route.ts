// Import the handler and configuration
import NextAuth from 'next-auth';
import { authOptions } from '@nl/playfab/utils';
import type { DefaultSession } from 'next-auth';
import type { DefaultJWT } from 'next-auth/jwt';
import type { User } from '@nl/playfab/types';

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

// Export the NextAuth handler functions
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
