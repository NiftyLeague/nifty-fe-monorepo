// https://docs.axelar.dev/dev/send-tokens/interchain-tokens/developer-guides/link-custom-tokens-deployed-across-multiple-chains-into-interchain-tokens/

import { readContract, waitForTransactionReceipt, writeContract } from '@wagmi/core'
import type { Config } from '@wagmi/core'
import type { TransactionReceipt } from 'viem'
import { parseEther, parseUnits } from 'viem'

import {
  INTERCHAIN_SERVICE_CONTRACT,
  INTERCHAIN_TOKEN_ID,
  INTERCHAIN_TOKEN_SERVICE_ADDRESS,
  NFTL_CONTRACT,
  getContractABI,
  getContractAddress,
} from '@/constants/contracts'
import {
  SEPOLIA_ID,
  MAINNET_ID,
  IMX_TESTNET_ID,
  NETWORK_NAME,
  TARGET_NETWORK,
} from '@/constants/networks'

type GasFeeResponse = {
  result?: {
    source_base_fee_string?: string
    source_token?: { decimals: number; gas_price: string | number }
  }
}

const AXELAR_GMP_ENDPOINT = {
  mainnet: 'https://api.gmp.axelarscan.io',
  testnet: 'https://testnet.api.gmp.axelarscan.io',
} as const

// Estimate the actual cost of deploying a Canonical Interchain Token on the remote chain.
// Keep this request local instead of importing Axelar's all-chains SDK for one EVM fee call.
const gasEstimator = async (chainId: number): Promise<bigint> => {
  const isTestnet = chainId === SEPOLIA_ID || chainId === IMX_TESTNET_ID
  const response = await fetch(AXELAR_GMP_ENDPOINT[isTestnet ? 'testnet' : 'mainnet'], {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: 'getFees',
      destinationChain: 'immutable',
      sourceChain: isTestnet ? 'ethereum-sepolia' : 'ethereum',
      sourceTokenSymbol: 'ETH',
    }),
  })

  if (!response.ok) throw new Error(`Axelar gas estimate failed (${response.status})`)

  const { result } = (await response.json()) as GasFeeResponse
  if (result?.source_base_fee_string === undefined || !result.source_token)
    throw new Error(`Axelar gas estimate returned an incomplete response`)

  const sourceBaseFee = parseUnits(result.source_base_fee_string, result.source_token.decimals)
  const sourceGasPrice = parseUnits(
    String(result.source_token.gas_price),
    result.source_token.decimals
  )
  const executionFee = 700_000n * sourceGasPrice

  // Match the previous SDK call: 700k gas with a 10% execution buffer.
  return sourceBaseFee + (executionFee * 11_000n) / 10_000n
}

const INTERCHAIN_TRANSFER_GAS_VALUE = parseEther('0.0001')

const nftlAddress = () => getContractAddress(TARGET_NETWORK.chainId, NFTL_CONTRACT) as `0x${string}`
const nftlAbi = () => getContractABI(TARGET_NETWORK.chainId, NFTL_CONTRACT)
const interchainServiceAddress = () =>
  getContractAddress(TARGET_NETWORK.chainId, INTERCHAIN_SERVICE_CONTRACT) as `0x${string}`
const interchainServiceAbi = () =>
  getContractABI(TARGET_NETWORK.chainId, INTERCHAIN_SERVICE_CONTRACT)

export const getInterchainTokenRecord = (chainId: number): string => {
  const interchainToken = INTERCHAIN_TOKEN_ID[chainId]
  if (!interchainToken)
    throw new Error(`Interchain token record not found for network: ${NETWORK_NAME[chainId]}`)
  return interchainToken
}

const getDestinationChain = (destinationChainId: number): string =>
  destinationChainId === SEPOLIA_ID
    ? 'ethereum-sepolia'
    : destinationChainId === MAINNET_ID
      ? 'ethereum'
      : 'immutable'

// Increase the allowance of the InterchainTokenManager to spend NFTL tokens on behalf of the user:
export const increaseBridgeAllowance = async (
  config: Config,
  address: `0x${string}`,
  destinationChainId: number,
  amount: bigint
): Promise<TransactionReceipt | null> => {
  const destinationChain = getDestinationChain(destinationChainId)

  if (destinationChain === 'immutable') {
    try {
      const allowance = (await readContract(config, {
        address: nftlAddress(),
        abi: nftlAbi(),
        functionName: 'allowance',
        args: [address, INTERCHAIN_TOKEN_SERVICE_ADDRESS],
        chainId: TARGET_NETWORK.chainId,
      })) as bigint
      if (allowance < amount) {
        const approveHash = await writeContract(config, {
          address: nftlAddress(),
          abi: nftlAbi(),
          functionName: 'approve',
          args: [INTERCHAIN_TOKEN_SERVICE_ADDRESS, amount],
          chainId: TARGET_NETWORK.chainId,
        })
        const txReceipt = await waitForTransactionReceipt(config, {
          hash: approveHash,
          confirmations: 1,
        })
        return txReceipt
      }
    } catch (error) {
      console.error('Error during transaction:', error)
      return null
    }
  }
  return null
}

// Transfer NFTL tokens to the InterchainTokenManager to mint the corresponding InterchainToken on the remote chain:
export const bridgeNFTL = async (
  config: Config,
  address: `0x${string}`,
  destinationChainId: number,
  amount: bigint
): Promise<TransactionReceipt | null> => {
  const interchainTokenId = getInterchainTokenRecord(destinationChainId)
  const gasAmount = await gasEstimator(destinationChainId)
  const destinationChain = getDestinationChain(destinationChainId)

  try {
    const txHash = await writeContract(config, {
      address: interchainServiceAddress(),
      abi: interchainServiceAbi(),
      functionName: 'interchainTransfer',
      args: [
        interchainTokenId, // interchainTokenId
        destinationChain, // destination chain
        address, // receiver address
        amount, // amount of token to transfer
        '0x', // metadata
        INTERCHAIN_TRANSFER_GAS_VALUE, // remote-execution gas limit param
      ],
      value: gasAmount,
      chainId: TARGET_NETWORK.chainId,
    })

    const txReceipt = await waitForTransactionReceipt(config, {
      hash: txHash,
      confirmations: 1,
    })
    return txReceipt
  } catch (error) {
    console.error('Error during transaction:', error)
    return null
  }
}
