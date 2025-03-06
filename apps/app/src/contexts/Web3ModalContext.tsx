'use client';

import { createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mainnet, sepolia, immutableZkEvm, immutableZkEvmTestnet, type Chain } from '@reown/appkit/networks';
import { State, WagmiProvider } from 'wagmi';

import type { PropsWithChildren } from 'react';
import type { CaipNetworkId } from '@reown/appkit';

import { getContractAddress, NFTL_CONTRACT } from '@/constants/contracts';
import { metadata, networks, projectId, wagmiAdapter } from './Web3ModalConfig';

// Setup queryClient
const queryClient = new QueryClient();

if (!projectId) throw new Error('Project ID is not defined');

const CaipNetworkID = (network: Chain) => `eip155:${network.id}` as CaipNetworkId;

// Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  defaultNetwork: mainnet,
  metadata,
  projectId,
  features: {
    analytics: true,
  },
  tokens: {
    [CaipNetworkID(mainnet)]: {
      address: getContractAddress(mainnet.id, NFTL_CONTRACT),
      image: 'https://niftyleague.com/img/logos/NFTL/logo.webp',
    },
    [CaipNetworkID(sepolia)]: {
      address: getContractAddress(sepolia.id, NFTL_CONTRACT),
      image: 'https://niftyleague.com/img/logos/NFTL/logo.webp',
    },
    [CaipNetworkID(immutableZkEvm)]: {
      address: getContractAddress(immutableZkEvm.id, NFTL_CONTRACT),
      image: 'https://niftyleague.com/img/logos/NFTL/logo.webp',
    },
    [CaipNetworkID(immutableZkEvmTestnet)]: {
      address: getContractAddress(immutableZkEvmTestnet.id, NFTL_CONTRACT),
      image: 'https://niftyleague.com/img/logos/NFTL/logo.webp',
    },
  },
  termsConditionsUrl: 'https://niftyleague.com/terms-of-service',
  privacyPolicyUrl: 'https://niftyleague.com/privacy-policy',
  themeMode: 'dark',
  enableEIP6963: true,
});

type Web3ModalProviderProps = {
  initialState?: State;
};

export function Web3ModalProvider({ children, initialState }: PropsWithChildren<Web3ModalProviderProps>) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
