'use client';

import { type PropsWithChildren } from 'react';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { State, WagmiProvider } from 'wagmi';
import type { Chain } from 'wagmi/chains';
import { wagmiConfig, projectId, chains } from './Web3ModalConfig';
import { getContractAddress, NFTL_CONTRACT } from '@/constants/contracts';

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
      address: getContractAddress(mainnet.id, NFTL_CONTRACT),
      image: 'https://niftyleague.com/img/logos/NFTL/logo.png',
    },
    [testnet.id]: {
      address: getContractAddress(testnet.id, NFTL_CONTRACT),
      image: 'https://niftyleague.com/img/logos/NFTL/logo.png',
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
