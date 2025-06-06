'use client';

import { SessionProvider } from 'next-auth/react';
import { PlayFabAuthForm } from '@nl/playfab/components';
import type { Session } from 'next-auth';

type AuthProviderProps = { children: React.ReactNode; session: Session | null };

export function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <SessionProvider session={session}>
      <PlayFabAuthForm.UserContextProvider>{children}</PlayFabAuthForm.UserContextProvider>
    </SessionProvider>
  );
}
