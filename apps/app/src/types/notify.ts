import type { TransactionResponse, TransactionRequest, TransactionReceipt } from 'ethers';
import type { EthereumTransactionLog, EthereumTransactionData, SDKError, NotificationObject } from 'bnc-sdk';
import type { EthereumRpcError, EthereumProviderError } from 'eth-rpc-errors';

type Deferrable<T> = { [K in keyof T]: T[K] | Promise<T[K]> };

export declare type TransactionData = EthereumTransactionData;
export declare type TransactionEventLog = EthereumTransactionLog;

export type NotifyTransaction = TransactionData | TransactionEventLog | TransactionReceipt;
export interface TransactionEvent {
  emitterResult: void | boolean | NotificationObject;
  transaction: NotifyTransaction;
}

export type EthersTransaction = Promise<TransactionResponse> | Deferrable<TransactionRequest>;

export type NotifyCallback = (res: NotifyTransaction | null) => void;

export type Tx = (tx: EthersTransaction, callback?: NotifyCallback) => Promise<TransactionResponse | null>;

export type MetamaskError = EthereumRpcError<unknown> | EthereumProviderError<unknown>;
export type NotifyError = SDKError | MetamaskError | Error | ErrorEvent;
