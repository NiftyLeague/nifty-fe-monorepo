// https://docs.axelar.dev/dev/send-tokens/interchain-tokens/developer-guides/link-custom-tokens-deployed-across-multiple-chains-into-interchain-tokens/

import { parseEther, parseUnits, formatEther } from 'ethers'
import type {
  AddressLike,
  Contract,
  ContractMethod,
  ContractTransactionReceipt,
  ContractTransactionResponse,
} from 'ethers'

import {
  INTERCHAIN_SERVICE_CONTRACT,
  INTERCHAIN_TOKEN_ID,
  INTERCHAIN_TOKEN_SERVICE_ADDRESS,
  NFTL_CONTRACT,
} from '@/constants/contracts'
import { SEPOLIA_ID, MAINNET_ID, IMX_TESTNET_ID, NETWORK_NAME } from '@/constants/networks'
import { DEBUG } from '@/constants'
import type { NFTLToken } from '@/types/typechain/src/contracts/NFTLToken'
import type { Contracts } from '@/types/web3'

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
    throw new Error('Axelar gas estimate returned an incomplete response')

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

export const getInterchainTokenRecord = (chainId: number): string => {
  const interchainToken = INTERCHAIN_TOKEN_ID[chainId]
  if (!interchainToken)
    throw new Error(`Interchain token record not found for network: ${NETWORK_NAME[chainId]}`)
  return interchainToken
}

const getInterchainTokenServiceContract = (writeContracts: Contracts): Contract =>
  writeContracts[INTERCHAIN_SERVICE_CONTRACT]

const getDestinationChain = (destinationChainId: number): string =>
  destinationChainId === SEPOLIA_ID
    ? 'ethereum-sepolia'
    : destinationChainId === MAINNET_ID
      ? 'ethereum'
      : 'immutable'

// Increase the allowance of the InterchainTokenManager to spend NFTL tokens on behalf of the user:
export const increaseBridgeAllowance = async (
  writeContracts: Contracts,
  address: AddressLike,
  destinationChainId: number,
  amount: bigint
): Promise<ContractTransactionReceipt | null> => {
  const destinationChain = getDestinationChain(destinationChainId)

  if (destinationChain === 'immutable') {
    try {
      const NFTL = writeContracts[NFTL_CONTRACT] as NFTLToken
      const allowance = await NFTL.allowance(address, INTERCHAIN_TOKEN_SERVICE_ADDRESS)
      if (allowance < amount) {
        const txRes = await NFTL.approve(INTERCHAIN_TOKEN_SERVICE_ADDRESS, amount)
        const txReceipt = await txRes.wait(1) // Wait for 1 block confirmation
        if (DEBUG) console.log('✅ InterchainTokenManager approved to spend NFTL')
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
  writeContracts: Contracts,
  address: AddressLike,
  destinationChainId: number,
  amount: bigint
): Promise<ContractTransactionReceipt | null> => {
  const interchainTokenService = getInterchainTokenServiceContract(writeContracts)
  const interchainTokenId = getInterchainTokenRecord(destinationChainId)
  const gasAmount = await gasEstimator(destinationChainId)
  const destinationChain = getDestinationChain(destinationChainId)

  if (DEBUG)
    console.log(
      `Sending ${formatEther(amount)} NFTL to ${destinationChain}... interchainTokenId: ${interchainTokenId}`
    )

  try {
    const interchainTransfer = interchainTokenService.interchainTransfer as ContractMethod
    if (typeof interchainTransfer !== 'function')
      throw new Error(`Function is not available on contract`)

    const txRes: ContractTransactionResponse = await interchainTransfer(
      interchainTokenId, // interchainTokenId
      destinationChain, // destination chain
      address, // receiver address
      amount, // amount of token to transfer
      '0x', // metadata
      INTERCHAIN_TRANSFER_GAS_VALUE,
      { value: gasAmount }
    )

    if (DEBUG) console.log('✅ Transfer Transaction Hash:', txRes?.hash)
    const txReceipt = await txRes.wait(1) // Wait for 1 block confirmation
    if (DEBUG) console.log('✅ NFTL tokens transferred to InterchainTokenManager')
    return txReceipt
  } catch (error) {
    console.error('Error during transaction:', error)
    return null
  }
}
