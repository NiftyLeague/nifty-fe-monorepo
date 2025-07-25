import { mainnet, sepolia } from 'viem/chains';
import WETH_ABI from './abis/weth.json';
import { INTERCHAIN_TOKEN_SERVICE_ADDRESS, WETH_ADDRESS } from '@/constants/contracts';
import INTERCHAIN_TOKEN_SERVICE_ABI from '@/constants/contracts/abis/@axelar-network/interchain-token-service/contracts/interchainTokenServiceABI.json';
import { LOCAL_CHAIN_ID } from '@/constants/networks';
import type { InterfaceAbi } from 'ethers6';

const EXTERNAL_CONTRACTS: {
  [chainId: number]: { [contractName: string]: { address: `0x${string}`; abi: InterfaceAbi } };
} = {
  [LOCAL_CHAIN_ID]: {},
  [sepolia.id]: {
    WETH: { address: WETH_ADDRESS[sepolia.id] as `0x${string}`, abi: WETH_ABI },
    InterchainTokenService: {
      address: INTERCHAIN_TOKEN_SERVICE_ADDRESS as `0x${string}`,
      abi: INTERCHAIN_TOKEN_SERVICE_ABI,
    },
  },
  [mainnet.id]: {
    WETH: { address: WETH_ADDRESS[mainnet.id] as `0x${string}`, abi: WETH_ABI },
    InterchainTokenService: {
      address: INTERCHAIN_TOKEN_SERVICE_ADDRESS as `0x${string}`,
      abi: INTERCHAIN_TOKEN_SERVICE_ABI,
    },
  },
};

export default EXTERNAL_CONTRACTS;
