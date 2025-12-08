// https://docs.axelar.dev/dev/send-tokens/interchain-tokens/developer-guides/link-custom-tokens-deployed-across-multiple-chains-into-interchain-tokens/

import { parseEther, formatEther } from 'ethers';
import type {
  AddressLike,
  Contract,
  ContractMethod,
  ContractTransactionReceipt,
  ContractTransactionResponse,
} from 'ethers';
import { AxelarQueryAPI, Environment, EvmChain, GasToken } from '@axelar-network/axelarjs-sdk';

import {
  INTERCHAIN_SERVICE_CONTRACT,
  INTERCHAIN_TOKEN_ID,
  INTERCHAIN_TOKEN_SERVICE_ADDRESS,
  NFTL_CONTRACT,
} from '@/constants/contracts';
import { SEPOLIA_ID, MAINNET_ID, IMX_TESTNET_ID, NETWORK_NAME } from '@/constants/networks';
import { DEBUG } from '@/constants';
import type { NFTLToken } from '@/types/typechain';
import type { Contracts } from '@/types/web3';

// Estimate the actual cost of deploying a Canonical Interchain Token on the remote chain:
const gasEstimator = async (chainId: number) => {
  if (chainId === SEPOLIA_ID || chainId === IMX_TESTNET_ID) {
    const api = new AxelarQueryAPI({ environment: Environment.TESTNET });
    return await api.estimateGasFee(EvmChain.SEPOLIA, EvmChain.IMMUTABLE, 700_000, 1.1, GasToken.SEPOLIA);
  } else {
    const api = new AxelarQueryAPI({ environment: Environment.MAINNET });
    return await api.estimateGasFee(EvmChain.ETHEREUM, EvmChain.IMMUTABLE, 700_000, 1.1, GasToken.ETH);
  }
};

export const getInterchainTokenRecord = async (chainId: number) => {
  const interchainToken = INTERCHAIN_TOKEN_ID[chainId];
  if (!interchainToken) throw new Error(`Interchain token record not found for network: ${NETWORK_NAME[chainId]}`);
  return interchainToken;
};

const getInterchainTokenServiceContract = (writeContracts: Contracts): Contract => {
  return writeContracts[INTERCHAIN_SERVICE_CONTRACT];
};

const getDestinationChain = (destinationChainId: number) => {
  return destinationChainId === SEPOLIA_ID
    ? EvmChain.SEPOLIA
    : destinationChainId === MAINNET_ID
      ? EvmChain.ETHEREUM
      : EvmChain.IMMUTABLE;
};

// Increase the allowance of the InterchainTokenManager to spend NFTL tokens on behalf of the user:
export const increaseBridgeAllowance = async (
  writeContracts: Contracts,
  address: AddressLike,
  destinationChainId: number,
  amount: bigint,
): Promise<ContractTransactionReceipt | null> => {
  const destinationChain = getDestinationChain(destinationChainId);

  if (destinationChain === EvmChain.IMMUTABLE) {
    try {
      const NFTL = writeContracts[NFTL_CONTRACT] as NFTLToken;
      const allowance = await NFTL.allowance(address, INTERCHAIN_TOKEN_SERVICE_ADDRESS);
      if (allowance < amount) {
        const txRes = await NFTL.approve(INTERCHAIN_TOKEN_SERVICE_ADDRESS, amount);
        const txReceipt = await txRes.wait(1); // Wait for 1 block confirmation
        if (DEBUG) console.log('✅ InterchainTokenManager approved to spend NFTL');
        return txReceipt;
      }
    } catch (error) {
      console.error('Error during transaction:', error);
      return null;
    }
  }
  return null;
};

// Transfer NFTL tokens to the InterchainTokenManager to mint the corresponding InterchainToken on the remote chain:
export const bridgeNFTL = async (
  writeContracts: Contracts,
  address: AddressLike,
  destinationChainId: number,
  amount: bigint,
): Promise<ContractTransactionReceipt | null> => {
  const interchainTokenService = await getInterchainTokenServiceContract(writeContracts);
  const interchainTokenId = await getInterchainTokenRecord(destinationChainId);
  const gasAmount = await gasEstimator(destinationChainId);
  const destinationChain = getDestinationChain(destinationChainId);

  if (DEBUG)
    console.log(
      `Sending ${formatEther(amount)} NFTL to ${destinationChain}... interchainTokenId: ${interchainTokenId}`,
    );

  try {
    const interchainTransfer = interchainTokenService.interchainTransfer as ContractMethod;
    if (typeof interchainTransfer !== 'function') throw new Error(`Function is not available on contract`);

    const txRes: ContractTransactionResponse = await interchainTransfer(
      interchainTokenId, // interchainTokenId
      destinationChain, // destination chain
      address, // receiver address
      amount, // amount of token to transfer
      '0x', // metadata
      parseEther('0.0001'), // gasValue
      { value: gasAmount },
    );

    if (DEBUG) console.log('✅ Transfer Transaction Hash:', txRes?.hash);
    const txReceipt = await txRes.wait(1); // Wait for 1 block confirmation
    if (DEBUG) console.log('✅ NFTL tokens transferred to InterchainTokenManager');
    return txReceipt;
  } catch (error) {
    console.error('Error during transaction:', error);
    return null;
  }
};
