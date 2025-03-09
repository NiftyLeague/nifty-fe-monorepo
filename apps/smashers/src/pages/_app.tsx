import '@/styles/globals.css';
import '@/styles/animations.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { PlayFabAuthForm } from '@nl/playfab/components';
import { StyledEngineProvider } from '@mui/material/styles';

import { FeatureFlagProvider } from '@/components/FeatureFlagsProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={'dark'}>
      <SessionProvider session={pageProps.session}>
        <PlayFabAuthForm.UserContextProvider>
          <StyledEngineProvider injectFirst>
            <FeatureFlagProvider>
              <Component {...pageProps} />
            </FeatureFlagProvider>
          </StyledEngineProvider>
        </PlayFabAuthForm.UserContextProvider>
      </SessionProvider>
    </main>
  );
}
