import { mainnet, sepolia, hardhat, immutableZkEvm, immutableZkEvmTestnet } from 'viem/chains';
import type { Network, NetworkName } from '@/types/web3';

export const NetworkContextName = 'NETWORK';

export const MAINNET_ID = mainnet.id;
export const SEPOLIA_ID = sepolia.id;
export const LOCAL_CHAIN_ID = hardhat.id;

export const IMX_ID = immutableZkEvm.id;
export const IMX_TESTNET_ID = immutableZkEvmTestnet.id;

export const NETWORK_ICON = {
  [MAINNET_ID]: '/img/logos/networks/mainnet-network.webp',
  [SEPOLIA_ID]: '/img/logos/networks/sepolia-network.webp',
  [LOCAL_CHAIN_ID]: '/img/logos/networks/sepolia-network.webp',
  [IMX_ID]: '/img/logos/networks/imx_zkEVM.webp',
  [IMX_TESTNET_ID]: '/img/logos/networks/imx_zkEVM.webp',
};

export const NETWORK_LABEL = {
  [MAINNET_ID]: mainnet.name,
  [SEPOLIA_ID]: sepolia.name,
  [LOCAL_CHAIN_ID]: hardhat.name,
  [IMX_ID]: immutableZkEvm.name,
  [IMX_TESTNET_ID]: immutableZkEvmTestnet.name,
};

// needs to match hardhat settings otherwise use rpcUrl for our publicProvider initialization
export const NETWORK_NAME: { [chainId: number]: NetworkName } = {
  [MAINNET_ID]: 'mainnet',
  [SEPOLIA_ID]: 'sepolia',
  [LOCAL_CHAIN_ID]: 'hardhat',
  [IMX_ID]: 'imtbl-zkevm-mainnet',
  [IMX_TESTNET_ID]: 'imtbl-zkevm-testnet',
};

export const RPC = {
  [MAINNET_ID]: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID as string}`,
  [SEPOLIA_ID]: `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID as string}`,
  [LOCAL_CHAIN_ID]: hardhat.rpcUrls.default.http[0],
  [IMX_ID]: immutableZkEvm.rpcUrls.default.http[0],
  [IMX_TESTNET_ID]: immutableZkEvmTestnet.rpcUrls.default.http[0],
};

export const NETWORKS: Record<NetworkName, Network> = {
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
  hardhat: {
    blockExplorer: '',
    chainId: LOCAL_CHAIN_ID,
    label: NETWORK_LABEL[LOCAL_CHAIN_ID],
    rpcUrl: RPC[LOCAL_CHAIN_ID],
  },
  'imtbl-zkevm-mainnet': {
    blockExplorer: immutableZkEvm.blockExplorers.default.url,
    chainId: IMX_ID,
    label: NETWORK_LABEL[IMX_ID],
    name: NETWORK_NAME[IMX_ID],
    rpcUrl: RPC[IMX_ID],
  },
  'imtbl-zkevm-testnet': {
    blockExplorer: immutableZkEvmTestnet.blockExplorers.default.url,
    chainId: IMX_TESTNET_ID,
    label: NETWORK_LABEL[IMX_TESTNET_ID],
    name: NETWORK_NAME[IMX_TESTNET_ID],
    rpcUrl: RPC[IMX_TESTNET_ID],
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

export const SUPPORTED_CHAIN_IDS: number[] = [MAINNET_ID, SEPOLIA_ID, LOCAL_CHAIN_ID, IMX_ID, IMX_TESTNET_ID];

export const VALID_NOTIFY_NETWORKS: number[] = [MAINNET_ID, SEPOLIA_ID];
