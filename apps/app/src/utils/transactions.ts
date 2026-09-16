import { toast } from 'solid-sonner'
import { toBeHex } from 'ethers'
import type {
  BaseContract,
  ContractMethod,
  JsonRpcSigner,
  TransactionReceipt,
  TransactionRequest,
  TransactionResponse,
} from 'ethers'

import { Contracts } from '@/types/web3'
import type { EthersTransaction, NotifyCallback, NotifyError, Tx } from '@/types/notify'
import { DEBUG } from '@/constants/index'
import { TARGET_NETWORK } from '@/constants/networks'
import { calculateGasMargin, loadGasPrice } from '@/utils/gas'

const ETHERSCAN_TX_URL = `${TARGET_NETWORK.blockExplorer}/tx/`

/**
 * Extract a human-readable message from wallet/RPC rejection errors. Covers
 * the shapes ethers v6 and MetaMask-family wallets throw (nested `error`,
 * `shortMessage`, `reason`) without a serialization dependency.
 */
const extractErrorMessage = (e: NotifyError): string => {
  const err = e as {
    message?: string
    shortMessage?: string
    reason?: string
    code?: string | number
    error?: { message?: string }
  }
  if (err.code === 'ACTION_REJECTED' || err.code === 4001) return 'Transaction rejected'
  return err.error?.message || err.shortMessage || err.message || err.reason || 'Unknown error'
}

export const handleError = (e: NotifyError): void => {
  console.error('Transaction Error', e)
  toast.error(`Transaction Error: ${extractErrorMessage(e)}`)
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

/**
 * Toast the transaction through its lifecycle and resolve the receipt.
 * Replaces the BlockNative Notify.js mempool watcher: same user-visible
 * states (sent → confirmed/reverted) with a plain provider receipt wait.
 */
export const notifyTransactionOutcome = async (
  signer: JsonRpcSigner,
  result: TransactionResponse,
  callback?: NotifyCallback
): Promise<void> => {
  const explorerUrl = result.hash ? `${ETHERSCAN_TX_URL}${result.hash}` : undefined
  toast.info(`${TARGET_NETWORK.label} Transaction Sent: ${result.hash}`, {
    position: 'bottom-right',
    action: explorerUrl
      ? {
          label: 'View',
          onClick: () => {
            if (typeof window !== 'undefined') window.open(explorerUrl)
          },
        }
      : undefined,
  })

  let receipt: TransactionReceipt | null = null
  try {
    receipt = await result.wait()
  } catch (e) {
    handleError(e as NotifyError)
    return
  }

  if (receipt?.status === 0) {
    toast.error(`${TARGET_NETWORK.label} Transaction Failed: ${result.hash}`, {
      position: 'bottom-right',
    })
    return
  }

  toast.success(`${TARGET_NETWORK.label} Transaction Successful: ${result.hash}`, {
    position: 'bottom-right',
  })
  if (callback) callback(receipt ?? (await signer.provider.getTransactionReceipt(result.hash)))
}
