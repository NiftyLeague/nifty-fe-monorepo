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

export const COMICS_BURNER_CONTRACT = 'NiftyBurningComicsL2';
export const DEGEN_CONTRACT = 'NiftyDegen';
export const GAME_ACCOUNT_CONTRACT = 'BalanceManager';
export const MARKETPLACE_CONTRACT = 'NiftyMarketplace';
export const NFTL_CONTRACT = 'NFTLToken';
export const NFTL_IMX_CONTRACT = 'NFTL';
export const NFTL_RAFFLE_CONTRACT = 'NFTLRaffle';

type ChainAddressSearch = { [chainId: number]: `0x${string}` };

export const MERKLE_DISTRIBUTOR_ADDRESS: ChainAddressSearch = {
  [MAINNET_ID]: '0x921c673a4d2f6a429551c0726316c1ad07571db5',
  // [SEPOLIA_ID]: '0xFeB2f45A3817EF9156a6c771FfC90098d3DFe003',
  // [LOCAL_CHAIN_ID]: '0x998abeb3E57409262aE5b751f60747921B33613E',
};

export const MERKLE_ROOT = 'https://raw.githubusercontent.com/NiftyLeague/merkle-distributor/master/data/result.json';

export const COMICS_MERKLE_DISTRIBUTOR_ADDRESS: ChainAddressSearch = {
  [MAINNET_ID]: '0x038FbfE31A113952C15C688Df5b025959f589ad7',
  // [SEPOLIA_ID]: '0x5DCcEEd8E10a3EE1aF095B248ad66E8F33875045',
  // [LOCAL_CHAIN_ID]: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
};

export const COMICS_MERKLE_ROOT =
  'https://raw.githubusercontent.com/NiftyLeague/merkle-distributor-comics56/main/data/result.json';

export const COWSWAP_VAULT_RELAYER_ADDRESS = '0xC92E8bdf79f0507f65a392b0ab4667716BFE0110';

export const WETH_ADDRESS: ChainAddressSearch = {
  [MAINNET_ID]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [SEPOLIA_ID]: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
};
