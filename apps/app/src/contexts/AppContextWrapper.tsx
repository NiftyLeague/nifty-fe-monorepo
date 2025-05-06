'use server';

// third party
import { type PropsWithChildren } from 'react';
import { headers } from 'next/headers';

// app context
import { AuthTokenProvider } from '@/contexts/AuthTokenContext';
import { FeatureFlagProvider } from '@/contexts/FeatureFlagsContext';
import { IMXProvider } from '@/contexts/IMXContext';
import { LocalStorageProvider } from '@/contexts/LocalStorageContext';
import { NetworkProvider } from '@/contexts/NetworkContext';
import { NFTsBalanceProvider } from '@/contexts/NFTsBalanceContext';
import { TokensBalanceProvider } from '@/contexts/TokensBalanceContext';
import { Web3ModalProvider } from '@/contexts/Web3ModalContext';
import ReduxProvider from '@/store/ReduxProvider';

const AppContextWrapper = async ({ children }: PropsWithChildren) => {
  const headersList = await headers();
  const cookies = headersList.get('cookie');
  return (
    <LocalStorageProvider>
      <Web3ModalProvider cookies={cookies}>
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
