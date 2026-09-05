/* eslint-disable no-console */
import { toast } from 'sonner'
import { toBeHex } from 'ethers'
import type {
  BaseContract,
  ContractMethod,
  JsonRpcSigner,
  TransactionRequest,
  TransactionResponse,
} from 'ethers'
import { serializeError } from 'eth-rpc-errors'

import { Contracts } from '@/types/web3'
import type { NotifyCallback, NotifyError, Tx, EthersTransaction } from '@/types/notify'
import { DEBUG } from '@/constants/index'
import { TARGET_NETWORK } from '@/constants/networks'
import { calculateGasMargin, loadGasPrice } from '@/utils/gas'

// Wrapper around BlockNative's wonderful Notify.js
// https://docs.blocknative.com/notify

export const handleError = (e: NotifyError): void => {
  console.error('Transaction Error', e)
  // Accounts for Metamask and default signer on all networks
  let message: string
  if (e.message) {
    message = e.message
  } else {
    const serialized = serializeError(e)
    message = serialized.message
  }

  // BlockNative's Notify.js will throw errors if the WebSocket disconnects. Not important to display.
  if (message === 'There was a WebSocket error' || message.includes('Configuration with scope')) {
    return
  }

  toast.error(`Transaction Error: ${message}`)
}

export const submitTxWithGasEstimate = async (
  tx: Tx,
  contract: Contracts[keyof Contracts],
  fn: string,
  args: unknown[],
  config: Record<string, unknown> = {},
  minimumGas?: bigint,
  callback?: NotifyCallback
): Promise<void | TransactionResponse | null> => {
  const contractFn = contract[fn as keyof BaseContract] as ContractMethod
  if (typeof contractFn !== 'function')
    throw new Error(`Function ${fn} is not available on contract`)

  const estimateGasFn = contractFn.estimateGas
  if (typeof estimateGasFn !== 'function')
    throw new Error(`Function Estimate Gas is not available on ${fn}`)

  try {
    const estimatedGasLimit = (await estimateGasFn(...args, config)) as bigint
    return await tx(
      contractFn(...args, {
        ...config,
        gasLimit: calculateGasMargin(estimatedGasLimit, minimumGas),
      }),
      callback
    )
  } catch (error) {
    handleError((error as ErrorEvent).error ?? (error as NotifyError))
    return null
  }
}

export const sendTransaction = async (
  signer: JsonRpcSigner,
  tx: EthersTransaction
): Promise<TransactionResponse> => {
  let result: TransactionResponse
  if (tx instanceof Promise) {
    if (DEBUG) console.log('AWAITING TX', tx)
    result = await tx
  } else {
    const safeTx = { ...tx } as TransactionRequest
    // TODO: Replace gasPrice with EIP-1559 specifications if non-promise txs are needed
    if (!tx.gasPrice) safeTx.gasPrice = await loadGasPrice(TARGET_NETWORK)
    if (!tx.gasLimit) safeTx.gasLimit = toBeHex(120000)
    if (DEBUG) console.log('RUNNING TX', safeTx)
    result = await (signer as JsonRpcSigner).sendTransaction(safeTx)
  }
  if (DEBUG) console.log('RESULT:', result)
  return result
}

export const handleLocalNotify = async (
  signer: JsonRpcSigner,
  result: TransactionResponse,
  callback?: NotifyCallback
) => {
  const networkName = TARGET_NETWORK.label
  toast.info(`${networkName} Transaction Sent: ${result.hash}`, { position: 'bottom-right' })
  await result.wait()
  toast.success(`${networkName} Transaction Successful: ${result.hash}`, {
    position: 'bottom-right',
  })
  // on most networks BlockNative will update a transaction handler,
  // but locally we will set an interval to listen...
  if (callback) {
    const currentTransactionReceipt = await signer.provider.getTransactionReceipt(result.hash)
    callback(currentTransactionReceipt)
  }
}
