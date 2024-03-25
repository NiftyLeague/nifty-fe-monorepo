import {
  type AlchemyProvider,
  type BrowserProvider,
  type Contract,
  type EtherscanProvider,
  type FallbackProvider,
  type InfuraProvider,
  type JsonRpcApiProvider,
  type JsonRpcProvider,
} from 'ethers6';

import {
  BalanceManager,
  HydraDistributor,
  NFTLRaffle,
  NFTLToken,
  NiftyBurningComicsL2,
  NiftyDegen,
  NiftyLaunchComics,
} from '@/types/typechain';
import {
  COMICS_BURNER_CONTRACT,
  COMICS_CONTRACT,
  DEGEN_CONTRACT,
  GAME_ACCOUNT_CONTRACT,
  HYDRA_DISTRIBUTOR,
  NFTL_CONTRACT,
  NFTL_RAFFLE_CONTRACT,
} from '@/constants/contracts';

export type MainnetProvider = InfuraProvider | EtherscanProvider | AlchemyProvider;

export type PublicProvider = FallbackProvider | JsonRpcProvider | JsonRpcApiProvider;

export type UserProvider = BrowserProvider;

export type Provider = PublicProvider | UserProvider | MainnetProvider;

export interface Ethereumish {
  autoRefreshOnNetworkChange?: boolean;
  chainId?: string;
  enable?: () => Promise<unknown>;
  isMetaMask?: boolean;
  isStatus?: boolean;
  networkVersion?: string;
  on?: (...args: unknown[]) => void;
  removeListener?: (...args: unknown[]) => void;
  request?: (request: { method: string; params?: Array<unknown> }) => Promise<unknown>;
  selectedAddress?: string;
  send?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: unknown, response: unknown) => void,
  ) => void;
  sendAsync?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: unknown, response: unknown) => void,
  ) => void;
}

// export interface Contracts extends Record<ContractName, Contract> {}
export interface Contracts {
  [COMICS_BURNER_CONTRACT]: NiftyBurningComicsL2;
  [COMICS_CONTRACT]: NiftyLaunchComics;
  [DEGEN_CONTRACT]: NiftyDegen;
  [GAME_ACCOUNT_CONTRACT]: BalanceManager;
  [HYDRA_DISTRIBUTOR]: HydraDistributor;
  [NFTL_CONTRACT]: NFTLToken;
  [NFTL_RAFFLE_CONTRACT]: NFTLRaffle;
  MerkleDistributor: Contract;
  // [contractName: string]: Contract;
}

export type NetworkName = 'mainnet' | 'sepolia' | 'hardhat';

export interface Network {
  blockExplorer: string;
  chainId: number;
  gasPrice?: bigint;
  label: string;
  name?: NetworkName;
  rpcUrl: string;
}

export interface GasStationResponse {
  fast: number;
  fastest: number;
  safeLow: number;
  average: number;
  block_time: number;
  blockNum: number;
  speed: number;
  safeLowWait: number;
  avgWait: number;
  fastWait: number;
  fastestWait: number;
  gasPriceRange: { [range: string]: number };
}
