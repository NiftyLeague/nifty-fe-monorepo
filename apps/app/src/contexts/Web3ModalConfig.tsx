import { mainnet, sepolia, hardhat, immutableZkEvm, immutableZkEvmTestnet, type Chain } from '@reown/appkit/networks';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { cookieStorage, createStorage } from '@wagmi/core';

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string;
if (!projectId) throw new Error('Project ID is not defined');

export const metadata = {
  name: 'Nifty League App',
  description: 'Nifty League Web3 Player Dashboards',
  url: 'https://app.niftyleague.com',
  icons: ['https://app.niftyleague.com/img/logos/NL/purple-filled.webp'],
};

export const networks: [Chain, ...Chain[]] = [mainnet, sepolia, immutableZkEvm, immutableZkEvmTestnet, hardhat];

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
});
