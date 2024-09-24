/* eslint-disable no-console */
import { useCallback } from 'react';
import Notify, { API, InitOptions } from 'bnc-notify';
import type { JsonRpcSigner } from 'ethers6';

import { handleError, handleLocalNotify, sendTransaction } from '@/utils/bnc-notify';
import type { NotifyCallback, NotifyError, Tx, TransactionEvent } from '@/types/notify';
import { VALID_NOTIFY_NETWORKS, TARGET_NETWORK } from '@/constants/networks';
import { DEBUG } from '@/constants/index';

const ETHERSCAN_TX_URL = `${TARGET_NETWORK.blockExplorer}/tx/`;

// Wrapper around BlockNative's wonderful Notify.js
// https://docs.blocknative.com/notify

const callbacks: { [hash: string]: NotifyCallback } = {};

const initializeNotify = (darkMode: boolean): API | null => {
  let options: InitOptions = {};
  let notify: API | null = null;
  if (navigator.onLine) {
    options = {
      dappId: process.env.NEXT_PUBLIC_BLOCKNATIVE_DAPPID, // GET YOUR OWN KEY AT https://account.blocknative.com
      system: 'ethereum',
      networkId: TARGET_NETWORK.chainId,
      darkMode,
      transactionHandler: txInformation => {
        const txData = (txInformation as TransactionEvent).transaction;
        if (DEBUG) console.log(`HANDLE TX ${txData.status?.toString().toUpperCase()}`, txInformation);
        const possibleFunction = txData.hash && callbacks[txData.hash];
        if (typeof possibleFunction === 'function') possibleFunction(txData);
      },
      onerror: (e: NotifyError) => {
        handleError(e);
      },
    };
    notify = Notify(options);
  }
  return notify;
};

export default function useNotify(signer?: JsonRpcSigner, darkMode = true): Tx {
  return useCallback(
    async (tx, callback) => {
      if (typeof signer !== 'undefined') {
        const notify = initializeNotify(darkMode);

        try {
          const result = await sendTransaction(signer, tx);
          if (callback) callbacks[result.hash] = callback;

          // if it is a valid Notify.js network, use that, if not, just send a default notification
          if (notify && VALID_NOTIFY_NETWORKS.includes(TARGET_NETWORK.chainId)) {
            const { emitter } = notify.hash(result.hash);
            emitter.on('all', transaction => ({
              onclick: () =>
                transaction.hash && typeof window !== 'undefined' && window.open(ETHERSCAN_TX_URL + transaction.hash),
            }));
          } else {
            await handleLocalNotify(signer, result, callback);
          }

          if (typeof result.wait === 'function') await result.wait();

          return result;
        } catch (e) {
          handleError(e as NotifyError);
          return null;
        }
      } else {
        return null;
      }
    },
    [signer, darkMode],
  );
}
