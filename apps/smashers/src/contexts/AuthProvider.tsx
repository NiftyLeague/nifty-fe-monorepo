'use client';

import { SessionProvider } from 'next-auth/react';
import { UserContextProvider } from '@nl/playfab/components/UserContextProvider';
import type { Session } from 'next-auth';

type AuthProviderProps = { children: React.ReactNode; session: Session | null };

export function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <SessionProvider session={session}>
      <UserContextProvider>{children}</UserContextProvider>
    </SessionProvider>
  );
}
