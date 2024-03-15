// third party
import { type PropsWithChildren } from 'react';
import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';

// app context
import { AuthTokenProvider } from '@/contexts/AuthTokenContext';
import { BalanceProvider } from '@/contexts/BalanceContext';
import { FeatureFlagProvider } from '@/contexts/FeatureFlagsContext';
import { LocalStorageProvider } from '@/contexts/LocalStorageContext';
import { NetworkProvider } from '@/contexts/NetworkContext';
import { Web3ModalProvider } from '@/contexts/Web3ModalContext';
import { wagmiConfig } from '@/contexts/Web3ModalConfig';
import ReduxProvider from '@/store/ReduxProvider';

const AppContextWrapper = ({ children }: PropsWithChildren) => {
  const initialState = cookieToInitialState(wagmiConfig, headers().get('cookie'));
  return (
    <LocalStorageProvider>
      <Web3ModalProvider initialState={initialState}>
        <NetworkProvider>
          <ReduxProvider>
            <AuthTokenProvider>
              <BalanceProvider>
                <FeatureFlagProvider>{children}</FeatureFlagProvider>
              </BalanceProvider>
            </AuthTokenProvider>
          </ReduxProvider>
        </NetworkProvider>
      </Web3ModalProvider>
    </LocalStorageProvider>
  );
};

export default AppContextWrapper;
