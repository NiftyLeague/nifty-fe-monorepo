'use client';

import { SessionProvider } from 'next-auth/react';
import { PlayFabAuthForm } from '@nl/playfab/components';
import { FeatureFlagProvider } from '@/components/FeatureFlagsProvider';
import { StyledEngineProvider } from '@mui/material/styles';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PlayFabAuthForm.UserContextProvider>
        <StyledEngineProvider injectFirst>
          <FeatureFlagProvider>{children}</FeatureFlagProvider>
        </StyledEngineProvider>
      </PlayFabAuthForm.UserContextProvider>
    </SessionProvider>
  );
}
