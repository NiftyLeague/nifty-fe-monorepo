// Import the handler and configuration
import NextAuth from 'next-auth';
import { authOptions } from './auth.config';

// Export the NextAuth handler functions
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
