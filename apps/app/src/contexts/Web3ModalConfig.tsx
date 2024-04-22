import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage } from 'wagmi';
import { mainnet, sepolia, hardhat, immutableZkEvm, immutableZkEvmTestnet, type Chain } from 'wagmi/chains';

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string;
if (!projectId) throw new Error('Project ID is not defined');

const metadata = {
  name: 'Nifty League App',
  description: 'Nifty League Web3 Player Dashboards',
  url: 'https://app.niftyleague.com',
  icons: ['https://app.niftyleague.com/img/logos/NL/purple-filled.webp'],
};

export const chains: [Chain, ...Chain[]] = [mainnet, sepolia, immutableZkEvm, immutableZkEvmTestnet, hardhat];

export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
});
