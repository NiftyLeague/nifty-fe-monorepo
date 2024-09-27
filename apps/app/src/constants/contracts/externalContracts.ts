import { mainnet, sepolia } from 'viem/chains';
import WETH_ABI from './abis/weth.json';
import COMICS_MERKLE_ABI from './abis/comics-merkle-distributor.json';
import { COMICS_MERKLE_DISTRIBUTOR_ADDRESS, WETH_ADDRESS } from '@/constants/contracts';
import { LOCAL_CHAIN_ID } from '@/constants/networks';
import type { InterfaceAbi } from 'ethers6';

const EXTERNAL_CONTRACTS: {
  [chainId: number]: {
    [contractName: string]: { address: `0x${string}`; abi: InterfaceAbi };
  };
} = {
  [LOCAL_CHAIN_ID]: {},
  [sepolia.id]: {
    ComicsMerkleDistributor: {
      address: COMICS_MERKLE_DISTRIBUTOR_ADDRESS[sepolia.id] as `0x${string}`,
      abi: COMICS_MERKLE_ABI,
    },
    WETH: {
      address: WETH_ADDRESS[sepolia.id] as `0x${string}`,
      abi: WETH_ABI,
    },
  },
  [mainnet.id]: {
    ComicsMerkleDistributor: {
      address: COMICS_MERKLE_DISTRIBUTOR_ADDRESS[mainnet.id] as `0x${string}`,
      abi: COMICS_MERKLE_ABI,
    },
    WETH: {
      address: WETH_ADDRESS[mainnet.id] as `0x${string}`,
      abi: WETH_ABI,
    },
  },
};

export default EXTERNAL_CONTRACTS;
