import { mainnet, goerli, hardhat } from 'viem/chains';
import type { Network, NetworkName } from '@/types/web3';

export const NetworkContextName = 'NETWORK';

export const MAINNET_ID = mainnet.id;
export const GOERLI_ID = goerli.id;
export const LOCAL_CHAIN_ID = hardhat.id;

export const NETWORK_ICON = {
  [MAINNET_ID]: '/images/networks/mainnet-network.jpg',
  [GOERLI_ID]: '/images/networks/goerli-network.jpg',
  [LOCAL_CHAIN_ID]: '/images/networks/goerli-network.jpg',
};

export const NETWORK_LABEL = {
  [MAINNET_ID]: mainnet.name,
  [GOERLI_ID]: goerli.name,
  [LOCAL_CHAIN_ID]: hardhat.name,
};

// needs to match hardhat settings otherwise use rpcUrl for our publicProvider initialization
export const NETWORK_NAME: { [chainId: number]: NetworkName } = {
  [MAINNET_ID]: 'mainnet',
  [GOERLI_ID]: 'goerli',
  [LOCAL_CHAIN_ID]: 'hardhat',
};

export const RPC = {
  [MAINNET_ID]: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID as string}`,
  [GOERLI_ID]: `https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID as string}`,
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
  goerli: {
    blockExplorer: goerli.blockExplorers.default.url,
    chainId: GOERLI_ID,
    label: NETWORK_LABEL[GOERLI_ID],
    name: NETWORK_NAME[GOERLI_ID],
    rpcUrl: RPC[GOERLI_ID],
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

export const SUPPORTED_CHAIN_IDS: number[] = [LOCAL_CHAIN_ID, MAINNET_ID, GOERLI_ID];

export const VALID_ETHERS_NETWORKS: number[] = [MAINNET_ID, GOERLI_ID];

export const VALID_NOTIFY_NETWORKS: number[] = [MAINNET_ID, GOERLI_ID];
