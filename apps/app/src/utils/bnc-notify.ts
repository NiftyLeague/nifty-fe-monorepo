/* eslint-disable no-console */
import { toast } from 'react-toastify';
import { toBeHex } from 'ethers6';
import type { BaseContract, ContractMethod, JsonRpcSigner, TransactionRequest, TransactionResponse } from 'ethers6';
import { serializeError } from 'eth-rpc-errors';
// import { setIntervalAsync, clearIntervalAsync } from 'set-interval-async/dynamic';

import { Contracts } from '@/types/web3';
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

  // BlockNative's Notify.js will throw errors if the WebSocket disconnects. Not important to display.
  if (message === 'There was a WebSocket error' || message.includes('Configuration with scope')) {
    return;
  }

  toast.error(({ data }) => `Transaction Error: ${data}`, {
    data: message,
    theme: 'dark',
  });
};

export const submitTxWithGasEstimate = (
  tx: Tx,
  contract: Contracts[keyof Contracts],
  fn: string,
  args: unknown[],
  config = {},
  minimumGas?: bigint,
  callback?: NotifyCallback,
): Promise<void | TransactionResponse | null> => {
  const contractFn = contract[fn as keyof BaseContract] as ContractMethod;
  if (typeof contractFn !== 'function') throw new Error(`Function ${fn} is not available on contract`);

  const estimateGasFn = contractFn.estimateGas;
  if (typeof estimateGasFn !== 'function') throw new Error(`Function Estimate Gas is not available on ${fn}`);

  return estimateGasFn(...args, config)
    .then(async (estimatedGasLimit: bigint) =>
      tx(contractFn(...args, { ...config, gasLimit: calculateGasMargin(estimatedGasLimit, minimumGas) }), callback),
    )
    .catch((error: ErrorEvent) => {
      handleError(error.error ?? error);
    });
};

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
