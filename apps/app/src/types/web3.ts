import type {
  AlchemyProvider,
  BrowserProvider,
  Contract,
  EtherscanProvider,
  FallbackProvider,
  InfuraProvider,
  JsonRpcApiProvider,
  JsonRpcProvider,
} from 'ethers';
import type { Abi } from 'viem';
import type { Config } from 'wagmi';

import type {
  BalanceManagerDistributor,
  NFTL,
  NFTLToken,
  NiftyBurningComicsL2,
  NiftyDegen,
  NiftyMarketplace,
} from '@/types/typechain';

import {
  BALANCE_MANAGER_CONTRACT,
  COMICS_BURNER_CONTRACT,
  DEGEN_CONTRACT,
  INTERCHAIN_SERVICE_CONTRACT,
  MARKETPLACE_CONTRACT,
  NFTL_CONTRACT,
  NFTL_IMX_CONTRACT,
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

export interface Contracts {
  [BALANCE_MANAGER_CONTRACT]: BalanceManagerDistributor;
  [COMICS_BURNER_CONTRACT]: NiftyBurningComicsL2;
  [DEGEN_CONTRACT]: NiftyDegen;
  [MARKETPLACE_CONTRACT]: NiftyMarketplace;
  [NFTL_CONTRACT]: NFTLToken;
  [NFTL_IMX_CONTRACT]: NFTL;
  [INTERCHAIN_SERVICE_CONTRACT]: Contract;
}

export type NetworkName = 'mainnet' | 'sepolia' | 'hardhat' | 'imtbl-zkevm-mainnet' | 'imtbl-zkevm-testnet';

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

export type UseReadContractParams<T extends { args: unknown[]; result: unknown }> = {
  abi: Abi;
  functionName: 'balanceOfBatch';
  args: T['args'];
  config: Config;
  result: T['result'];
};
