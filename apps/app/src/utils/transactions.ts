import { toast } from 'solid-sonner'

import type { NotifyError } from '@/types/notify'
import { TARGET_NETWORK } from '@/constants/networks'

/**
 * Extract a human-readable message from wallet/RPC rejection errors. Covers
 * the shapes ethers v6 and MetaMask-family wallets throw (nested `error`,
 * `shortMessage`, `reason`) without a serialization dependency.
 */
const extractErrorMessage = (e: unknown): string => {
  const err = (e instanceof Error ? { message: e.message } : (e ?? {})) as {
    message?: string
    shortMessage?: string
    reason?: string
    code?: string | number
    error?: { message?: string }
  }
  if (err.code === 'ACTION_REJECTED' || err.code === 4001) return 'Transaction rejected'
  return err.error?.message || err.shortMessage || err.message || err.reason || 'Unknown error'
}

export const handleError = (e: unknown): void => {
  console.error('Transaction Error', e)
  toast.error(`Transaction Error: ${extractErrorMessage(e)}`)
}

// —— viem write pipeline (phase 2 of the viem consolidation) ——

import type { Config } from '@wagmi/core'
import { writeContract, waitForTransactionReceipt } from '@wagmi/core'
import type { Abi, Hash } from 'viem'

export interface ContractWriteParams {
  chainId?: number
  address: `0x${string}`
  abi: Abi
  functionName: string
  args?: readonly unknown[] | undefined
  value?: bigint
  gas?: bigint
}

export type WriteReceiptCallback = (
  receipt: Awaited<ReturnType<typeof waitForTransactionReceipt>>
) => void

/**
 * Send a contract write and toast its lifecycle (sent → confirmed/reverted)
 * with an explorer link. viem's writeContract simulates first (reverts surface
 * before spending gas); the receipt wait replaces the ethers
 * TransactionResponse pipeline.
 *
 * Never throws: user rejections and failures return null so callers can use
 * plain truthiness checks, matching the previous notify pipeline.
 */
export const executeContractWrite = async (
  config: Config,
  params: ContractWriteParams,
  callback?: WriteReceiptCallback
): Promise<Hash | null> => {
  try {
    const { chainId: _chainId, ...writeParams } = params
    const hash = await writeContract(config, {
      ...writeParams,
      args: writeParams.args ?? [],
      ...(params.chainId !== undefined ? { chainId: params.chainId } : {}),
    } as never)

    const explorerUrl = `${TARGET_NETWORK.blockExplorer}/tx/${hash}`
    toast.info(`${TARGET_NETWORK.label} Transaction Sent: ${hash}`, {
      position: 'bottom-right',
      action: {
        label: 'View',
        onClick: () => {
          if (typeof window !== 'undefined') window.open(explorerUrl)
        },
      },
    })

    const receipt = await waitForTransactionReceipt(config, { hash })

    if (receipt.status === 'reverted') {
      toast.error(`${TARGET_NETWORK.label} Transaction Failed: ${hash}`, {
        position: 'bottom-right',
      })
      return null
    }

    toast.success(`${TARGET_NETWORK.label} Transaction Successful: ${hash}`, {
      position: 'bottom-right',
    })
    callback?.(receipt)
    return hash
  } catch (e) {
    handleError(e as NotifyError)
    return null
  }
}
