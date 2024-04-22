'use client';

import { type PropsWithChildren } from 'react';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mainnet, sepolia, immutableZkEvmTestnet } from 'wagmi/chains';
import { State, WagmiProvider } from 'wagmi';

import { getContractAddress, NFTL_CONTRACT } from '@/constants/contracts';
import { wagmiConfig, projectId } from './Web3ModalConfig';

// Setup queryClient
const queryClient = new QueryClient();

if (!projectId) throw new Error('Project ID is not defined');

// Create modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  defaultChain: mainnet,
  tokens: {
    [mainnet.id]: {
      address: getContractAddress(mainnet.id, NFTL_CONTRACT),
      image: 'https://niftyleague.com/img/logos/NFTL/logo.webp',
    },
    [sepolia.id]: {
      address: getContractAddress(sepolia.id, NFTL_CONTRACT),
      image: 'https://niftyleague.com/img/logos/NFTL/logo.webp',
    },
    [immutableZkEvmTestnet.id]: {
      address: getContractAddress(immutableZkEvmTestnet.id, NFTL_CONTRACT),
      image: 'https://niftyleague.com/img/logos/NFTL/logo.webp',
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
