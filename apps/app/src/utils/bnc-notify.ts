/* eslint-disable no-console */
import { toast } from 'react-toastify';
import { toBeHex } from 'ethers';
import type {
  BaseContract,
  Contract,
  ContractMethod,
  JsonRpcSigner,
  TransactionRequest,
  TransactionResponse,
} from 'ethers';
import { serializeError } from 'eth-rpc-errors';
// import { setIntervalAsync, clearIntervalAsync } from 'set-interval-async/dynamic';

import type { NotifyCallback, NotifyError, Tx, EthersTransaction } from '@/types/notify';
import { DEBUG } from '@/constants/index';
import { TARGET_NETWORK } from '@/constants/networks';
import { calculateGasMargin, loadGasPrice } from '@/utils/gas';

// Wrapper around BlockNative's wonderful Notify.js
// https://docs.blocknative.com/notify

export const handleError = (e: NotifyError): void => {
  console.error('Transaction Error', e);
  // Accounts for Metamask and default signer on all networks
  let message: string;
  if (e.message) {
    message = e.message;
  } else {
    const serialized = serializeError(e);
    message = serialized.message;
  }

  toast.error(({ data }) => `Transaction Error: ${data}`, {
    data: message,
    theme: 'dark',
  });
};

export const submitTxWithGasEstimate = (
  tx: Tx,
  contract: BaseContract,
  fn: string,
  args: unknown[],
  config = {},
  minimumGas?: bigint,
  callback?: NotifyCallback,
): Promise<void | TransactionResponse | null> =>
  // @ts-expect-error - This is a valid call, but ethers is not typed correctly
  (contract as Contract).estimateGas[fn](...args, config)
    .then(async (estimatedGasLimit: bigint) =>
      tx(
        ((contract as Contract)[fn] as ContractMethod)(...args, {
          ...config,
          gasLimit: calculateGasMargin(estimatedGasLimit, minimumGas),
        }),
        callback,
      ),
    )
    .catch((error: ErrorEvent) => {
      handleError(error.error ?? error);
    });

export const sendTransaction = async (signer: JsonRpcSigner, tx: EthersTransaction): Promise<TransactionResponse> => {
  let result: TransactionResponse;
  if (tx instanceof Promise) {
    if (DEBUG) console.log('AWAITING TX', tx);
    result = await tx;
  } else {
    const safeTx = { ...tx } as TransactionRequest;
    // TODO: Replace gasPrice with EIP-1559 specifications if non-promise txs are needed
    if (!tx.gasPrice) safeTx.gasPrice = await loadGasPrice(TARGET_NETWORK);
    if (!tx.gasLimit) safeTx.gasLimit = toBeHex(120000);
    if (DEBUG) console.log('RUNNING TX', safeTx);
    result = await (signer as JsonRpcSigner).sendTransaction(safeTx);
  }
  if (DEBUG) console.log('RESULT:', result);
  return result;
};

export const handleLocalNotify = async (
  signer: JsonRpcSigner,
  result: TransactionResponse,
  callback?: NotifyCallback,
) => {
  const networkName = TARGET_NETWORK.label;
  toast.info(({ data }) => `${networkName} Transaction Sent: ${data}`, {
    data: result.hash,
    position: 'bottom-right',
    theme: 'dark',
  });
  await result.wait();
  toast.success(({ data }) => `${networkName} Transaction Successful: ${data}`, {
    data: result.hash,
    position: 'bottom-right',
    theme: 'dark',
  });
  // on most networks BlockNative will update a transaction handler,
  // but locally we will set an interval to listen...
  if (callback) {
    // const txResult = await tx;
    // res = result || txResult?
    // const listeningInterval = setIntervalAsync(async () => {
    //   console.log('CHECK IN ON THE TX', result, provider);
    //   const currentTransactionReceipt = await (provider as Provider).getTransactionReceipt(result.hash);
    //   if (currentTransactionReceipt && currentTransactionReceipt.confirmations) {
    //     callback({ ...result, ...currentTransactionReceipt });
    //     void (async () => {
    //       await clearIntervalAsync(listeningInterval);
    //     })();
    //   }
    // }, 1000);
    const currentTransactionReceipt = await signer.provider.getTransactionReceipt(result.hash);
    callback(currentTransactionReceipt);
  }
};
