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
