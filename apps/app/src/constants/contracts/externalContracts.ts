import { mainnet, sepolia } from 'viem/chains';
import WETH_ABI from './abis/weth.json';
import COMICS_MERKLE_ABI from './abis/comics-merkle-distributor.json';
import MERKLE_ABI from './abis/merkle-distributor.json';
import { COMICS_MERKLE_DISTRIBUTOR_ADDRESS, MERKLE_DISTRIBUTOR_ADDRESS } from '@/constants/contracts';
import { LOCAL_CHAIN_ID } from '@/constants/networks';
import type { InterfaceAbi } from 'ethers6';

const EXTERNAL_CONTRACTS: {
  [chainId: number]: {
    [contractName: string]: { address: `0x${string}`; abi: InterfaceAbi };
  };
} = {
  [LOCAL_CHAIN_ID]: {},
  [sepolia.id]: {},
  [mainnet.id]: {
    WETH: {
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      abi: WETH_ABI,
    },
    MerkleDistributor: {
      address: MERKLE_DISTRIBUTOR_ADDRESS[mainnet.id] as `0x${string}`,
      abi: MERKLE_ABI,
    },
    ComicsMerkleDistributor: {
      address: COMICS_MERKLE_DISTRIBUTOR_ADDRESS[mainnet.id] as `0x${string}`,
      abi: COMICS_MERKLE_ABI,
    },
  },
};

export default EXTERNAL_CONTRACTS;
