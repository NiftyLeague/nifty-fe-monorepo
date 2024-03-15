'use client';

import { type PropsWithChildren } from 'react';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { State, WagmiProvider } from 'wagmi';
import type { Chain } from 'wagmi/chains';
import { wagmiConfig, projectId, chains } from './Web3ModalConfig';
import { NFTL_TOKEN_ADDRESS } from '@/constants/contracts';

// Setup queryClient
const queryClient = new QueryClient();

if (!projectId) throw new Error('Project ID is not defined');

const [mainnet, testnet] = chains as [Chain, Chain];

// Create modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  defaultChain: mainnet,
  tokens: {
    [mainnet.id]: {
      address: NFTL_TOKEN_ADDRESS[mainnet.id] as string,
      image: 'https://app.niftyleague.com/images/NFTL.png',
    },
    [testnet.id]: {
      address: NFTL_TOKEN_ADDRESS[testnet.id] as string,
      image: 'https://app.niftyleague.com/images/NFTL.png',
    },
  },
  enableAnalytics: true,
  termsConditionsUrl: 'https://niftyleague.com/terms-of-service',
  privacyPolicyUrl: 'https://niftyleague.com/privacy-policy',
  themeMode: 'dark',
});

type Web3ModalProviderProps = {
  initialState?: State;
};

export function Web3ModalProvider({ children, initialState }: PropsWithChildren<Web3ModalProviderProps>) {
  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
