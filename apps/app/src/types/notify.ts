import type { TransactionReceipt, TransactionRequest, TransactionResponse } from 'ethers'

type Deferrable<T> = { [K in keyof T]: T[K] | Promise<T[K]> }

export type EthersTransaction = Promise<TransactionResponse> | Deferrable<TransactionRequest>

export type NotifyCallback = (res: TransactionReceipt | null) => void

export type Tx = (
  tx: EthersTransaction,
  callback?: NotifyCallback
) => Promise<TransactionResponse | null>

/** The error shapes wallets, RPC providers, and ethers throw at us. */
export type NotifyError =
  | Error
  | {
      code?: string | number
      message?: string
      shortMessage?: string
      reason?: string
      error?: { message?: string }
    }
