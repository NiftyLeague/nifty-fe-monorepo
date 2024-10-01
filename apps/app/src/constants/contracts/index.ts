import type { Abi } from 'viem';
import type { Network } from '@/types/web3';
import { IMX_ID, IMX_TESTNET_ID, MAINNET_ID, SEPOLIA_ID } from '../networks';
import DEPLOYMENTS from './deployments';

export const getDeployedContract = (chainId: Network['chainId'], contractName: string) => {
  const deployments = DEPLOYMENTS[chainId] as {
    [contractName: string]: {
      address: `0x${string}`;
      abi: Abi;
    };
  };
  return deployments[contractName];
};

export const getContractAddress = (chainId: Network['chainId'], contractName: string) => {
  return getDeployedContract(chainId, contractName)?.address as `0x${string}`;
};

export const getContractABI = (chainId: Network['chainId'], contractName: string) => {
  return getDeployedContract(chainId, contractName)?.abi as Abi;
};

// Ethereum contracts
export const COMICS_BURNER_CONTRACT = 'NiftyBurningComicsL2';
export const DEGEN_CONTRACT = 'NiftyDegen';
export const NFTL_CONTRACT = 'NFTLToken';

// Immutable zkEVM contracts
export const BALANCE_MANAGER_CONTRACT = 'BalanceManagerDistributor';
export const MARKETPLACE_CONTRACT = 'NiftyMarketplace';
export const NFTL_IMX_CONTRACT = 'NFTL';

// External contracts
export const INTERCHAIN_SERVICE_CONTRACT = 'InterchainTokenService';

// Merkle Distributors
export const MERKLE_TREE =
  'https://raw.githubusercontent.com/NiftyLeague/nifty-smart-contracts/refs/heads/main/src/data/merkle-result.json';

// Other
export const COWSWAP_VAULT_RELAYER_ADDRESS = '0xC92E8bdf79f0507f65a392b0ab4667716BFE0110';

type ChainAddressSearch = { [chainId: number]: `0x${string}` };
export const WETH_ADDRESS: ChainAddressSearch = {
  [MAINNET_ID]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [SEPOLIA_ID]: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
};

export const INTERCHAIN_TOKEN_SERVICE_ADDRESS = '0xB5FB4BE02232B1bBA4dC8f81dc24C26980dE9e3C';

const TESTNET_INTERCHAIN_TOKEN_ID = '0xb85065c482809a2320b9da241fa4fae1e4a3ed76c481ea6d82ba791fb85671e5';
const MAINNET_INTERCHAIN_TOKEN_ID = '0x6ce7a978114b2d34ee7b776ef36ee49c18752e35b7507c16994d5928332a6426';

export const INTERCHAIN_TOKEN_ID: ChainAddressSearch = {
  [MAINNET_ID]: MAINNET_INTERCHAIN_TOKEN_ID,
  [SEPOLIA_ID]: TESTNET_INTERCHAIN_TOKEN_ID,
  [IMX_ID]: MAINNET_INTERCHAIN_TOKEN_ID,
  [IMX_TESTNET_ID]: TESTNET_INTERCHAIN_TOKEN_ID,
};
