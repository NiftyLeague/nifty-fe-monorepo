'use server';

// third party
import { type PropsWithChildren } from 'react';
import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';

// app context
import { AuthTokenProvider } from '@/contexts/AuthTokenContext';
import { FeatureFlagProvider } from '@/contexts/FeatureFlagsContext';
import { IMXProvider } from '@/contexts/IMXContext';
import { LocalStorageProvider } from '@/contexts/LocalStorageContext';
import { NetworkProvider } from '@/contexts/NetworkContext';
import { NFTsBalanceProvider } from '@/contexts/NFTsBalanceContext';
import { TokensBalanceProvider } from '@/contexts/TokensBalanceContext';
import { wagmiAdapter } from '@/contexts/Web3ModalConfig';
import { Web3ModalProvider } from '@/contexts/Web3ModalContext';
import ReduxProvider from '@/store/ReduxProvider';

const AppContextWrapper = async ({ children }: PropsWithChildren) => {
  const headersList = await headers();
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, headersList.get('cookie'));
  return (
    <LocalStorageProvider>
      <Web3ModalProvider initialState={initialState}>
        <NetworkProvider>
          <IMXProvider>
            <ReduxProvider>
              <AuthTokenProvider>
                <NFTsBalanceProvider>
                  <TokensBalanceProvider>
                    <FeatureFlagProvider>{children}</FeatureFlagProvider>
                  </TokensBalanceProvider>
                </NFTsBalanceProvider>
              </AuthTokenProvider>
            </ReduxProvider>
          </IMXProvider>
        </NetworkProvider>
      </Web3ModalProvider>
    </LocalStorageProvider>
  );
};

export default AppContextWrapper;
