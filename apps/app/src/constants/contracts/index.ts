import type { InterfaceAbi } from 'ethers6';
import type { Network } from '@/types/web3';
import { SEPOLIA_ID, MAINNET_ID } from '../networks';
import DEPLOYMENTS from './deployments';

export const getDeployedContract = (chainId: Network['chainId'], contractName: string) => {
  const deployments = DEPLOYMENTS[chainId] as {
    [contractName: string]: {
      address: `0x${string}`;
      abi: InterfaceAbi;
    };
  };
  return deployments[contractName];
};

export const getContractAddress = (chainId: Network['chainId'], contractName: string) => {
  return getDeployedContract(chainId, contractName)?.address as `0x${string}`;
};

export const getContractABI = (chainId: Network['chainId'], contractName: string) => {
  return getDeployedContract(chainId, contractName)?.abi as InterfaceAbi;
};

// Ethereum contracts
export const COMICS_BURNER_CONTRACT = 'NiftyBurningComicsL2';
export const DEGEN_CONTRACT = 'NiftyDegen';
export const NFTL_CONTRACT = 'NFTLToken';

// Immutable zkEVM contracts
export const BALANCE_MANAGER_CONTRACT = 'BalanceManagerDistributor';
export const MARKETPLACE_CONTRACT = 'NiftyMarketplace';
export const NFTL_IMX_CONTRACT = 'NFTL';

// Merkle Distributors

export const MERKLE_TREE =
  'https://raw.githubusercontent.com/NiftyLeague/nifty-smart-contracts/refs/heads/main/src/data/merkle-result.json';

export const COMICS_MERKLE_TREE =
  'https://raw.githubusercontent.com/NiftyLeague/merkle-distributor-comics56/main/data/result.json';

type ChainAddressSearch = { [chainId: number]: `0x${string}` };

export const COMICS_MERKLE_DISTRIBUTOR_ADDRESS: ChainAddressSearch = {
  [MAINNET_ID]: '0x038FbfE31A113952C15C688Df5b025959f589ad7',
  [SEPOLIA_ID]: '0x5DCcEEd8E10a3EE1aF095B248ad66E8F33875045',
};

// Other

export const COWSWAP_VAULT_RELAYER_ADDRESS = '0xC92E8bdf79f0507f65a392b0ab4667716BFE0110';

export const WETH_ADDRESS: ChainAddressSearch = {
  [MAINNET_ID]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [SEPOLIA_ID]: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
};
