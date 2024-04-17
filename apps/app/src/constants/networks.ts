import { mainnet, sepolia, hardhat } from 'viem/chains';
import type { Network, NetworkName } from '@/types/web3';

export const NetworkContextName = 'NETWORK';

export const MAINNET_ID = mainnet.id;
export const SEPOLIA_ID = sepolia.id;
export const LOCAL_CHAIN_ID = hardhat.id;

export const NETWORK_ICON = {
  [MAINNET_ID]: '/img/logos/networks/mainnet-network.jpg',
  [SEPOLIA_ID]: '/img/logos/networks/sepolia-network.jpg',
  [LOCAL_CHAIN_ID]: '/img/logos/networks/sepolia-network.jpg',
};

export const NETWORK_LABEL = {
  [MAINNET_ID]: mainnet.name,
  [SEPOLIA_ID]: sepolia.name,
  [LOCAL_CHAIN_ID]: hardhat.name,
};

// needs to match hardhat settings otherwise use rpcUrl for our publicProvider initialization
export const NETWORK_NAME: { [chainId: number]: NetworkName } = {
  [MAINNET_ID]: 'mainnet',
  [SEPOLIA_ID]: 'sepolia',
  [LOCAL_CHAIN_ID]: 'hardhat',
};

export const RPC = {
  [MAINNET_ID]: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID as string}`,
  [SEPOLIA_ID]: `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID as string}`,
  [LOCAL_CHAIN_ID]: hardhat.rpcUrls.default.http[0],
};

export const NETWORKS: { [network: string]: Network } = {
  mainnet: {
    blockExplorer: mainnet.blockExplorers.default.url,
    chainId: MAINNET_ID,
    label: NETWORK_LABEL[MAINNET_ID],
    name: NETWORK_NAME[MAINNET_ID],
    rpcUrl: RPC[MAINNET_ID],
  },
  sepolia: {
    blockExplorer: sepolia.blockExplorers.default.url,
    chainId: SEPOLIA_ID,
    label: NETWORK_LABEL[SEPOLIA_ID],
    name: NETWORK_NAME[SEPOLIA_ID],
    rpcUrl: RPC[SEPOLIA_ID],
  },
  localhost: {
    blockExplorer: '',
    chainId: LOCAL_CHAIN_ID,
    label: NETWORK_LABEL[LOCAL_CHAIN_ID],
    rpcUrl: RPC[LOCAL_CHAIN_ID],
  },
};

export const NETWORK = (chainId: number): Network =>
  Object.values(NETWORKS).find(n => n.chainId === chainId) || {
    blockExplorer: '',
    chainId: 1,
    label: '',
    rpcUrl: '',
  };

export const TARGET_NETWORK: Network = NETWORKS[process.env.NEXT_PUBLIC_NETWORK as NetworkName] as Network;

export const SUPPORTED_CHAIN_IDS: number[] = [LOCAL_CHAIN_ID, MAINNET_ID, SEPOLIA_ID];

export const VALID_ETHERS_NETWORKS: number[] = [MAINNET_ID, SEPOLIA_ID];

export const VALID_NOTIFY_NETWORKS: number[] = [MAINNET_ID, SEPOLIA_ID];
