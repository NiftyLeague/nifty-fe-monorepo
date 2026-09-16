import type { Accessor } from 'solid-js'
import type { JsonRpcSigner } from 'ethers'

import { handleError, notifyTransactionOutcome, sendTransaction } from '@/utils/transactions'
import type { NotifyError, Tx } from '@/types/notify'
import { DEBUG } from '@/constants/index'

/**
 * Send a transaction and toast its lifecycle (sent → confirmed/reverted)
 * with an explorer link. Replaces the BlockNative Notify.js client: the same
 * user-visible states now come from the provider receipt wait, with no
 * third-party websocket, dappId, or mempool subscription.
 */
export default function useNotify(
  signer?: Accessor<JsonRpcSigner | undefined>,
  _darkMode = true
): Tx {
  return async (tx, callback) => {
    const activeSigner = signer?.()
    if (typeof activeSigner === 'undefined') return null

    try {
      const result = await sendTransaction(activeSigner, tx)

      if (DEBUG) console.log('NOTIFY TX', result.hash)
      await notifyTransactionOutcome(activeSigner, result, callback)

      return result
    } catch (e) {
      handleError(e as NotifyError)
      return null
    }
  }
}
