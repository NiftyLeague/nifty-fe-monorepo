'use client';

import { SessionProvider } from 'next-auth/react';
import { PlayFabAuthForm } from '@nl/playfab/components';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PlayFabAuthForm.UserContextProvider>{children}</PlayFabAuthForm.UserContextProvider>
    </SessionProvider>
  );
}
