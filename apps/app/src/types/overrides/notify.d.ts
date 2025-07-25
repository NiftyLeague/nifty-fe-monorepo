import { BitcoinTransactionLog, EthereumTransactionLog, SDKError, TransactionHandler, System } from 'bnc-sdk';
interface InitOptions extends ConfigOptions {
  dappId?: string;
  transactionHandler?: TransactionHandler;
  name?: string;
  apiUrl?: string;
  onerror?: ErrorHandler;
}
type ErrorHandler = (error: SDKError) => void;
interface TransactionEvent {
  emitterResult: void | boolean | CustomNotificationObject;
  transaction: TransactionData;
}
type TransactionEventCode =
  | 'txSent'
  | 'txPool'
  | 'txStuck'
  | 'txConfirmed'
  | 'txSpeedUp'
  | 'txCancel'
  | 'txFailed'
  | 'txRequest'
  | 'nsfFail'
  | 'txRepeat'
  | 'txAwaitingApproval'
  | 'txConfirmReminder'
  | 'txSendFail'
  | 'txError'
  | 'txUnderPriced'
  | 'all';
interface TransactionData {
  asset?: string;
  blockHash?: string;
  blockNumber?: number;
  contractCall?: ContractCall | DecodedContractCall;
  counterparty?: string;
  eventCode?: string;
  from?: string;
  gas?: string;
  gasPrice?: string;
  hash?: string;
  txid?: string;
  id?: string;
  input?: string;
  monitorId?: string;
  monitorVersion?: string;
  nonce?: number;
  replaceHash?: string;
  r?: string;
  s?: string;
  status?: string;
  to?: string;
  transactionIndex?: number;
  v?: string;
  value?: string | number;
  startTime?: number;
  watchedAddress?: string;
  originalHash?: string;
  direction?: string;
  system?: string;
  inputs?: BitcoinInputOutput[];
  outputs?: BitcoinInputOutput[];
  baseFeePerGasGwei?: number;
  maxPriorityFeePerGasGwei?: number;
  maxFeePerGasGwei?: number;
  gasPriceGwei?: number;
}
type NotificationType = 'pending' | 'success' | 'error' | 'hint';
interface CustomNotificationObject {
  type?: NotificationType;
  message?: string;
  autoDismiss?: number;
  onclick?: (event: any) => void;
  eventCode?: string;
  link?: string;
}
interface BitcoinInputOutput {
  address: string;
  value: string;
}
interface NotificationObject {
  id: string;
  type: NotificationType;
  key: string;
  startTime?: number;
  eventCode?: string;
  message: string;
  autoDismiss?: number;
}
interface ContractCall {
  methodName: string;
  params: string[];
}
interface DecodedContractCall {
  contractAddress?: string;
  contractType?: string;
  params: object;
  methodName: string;
}
interface NotifyMessages {
  [key: string]: LocaleMessages;
}
interface LocaleMessages {
  transaction: { [key: string]: string };
  watched: { [key: string]: string };
  time: { [key: string]: string };
}
interface TransactionOptions {
  sendTransaction?: () => Promise<string>;
  estimateGas?: () => Promise<string>;
  gasPrice?: () => Promise<string>;
  balance?: string;
  contractCall?: ContractCall;
  txDetails?: { to?: string; from?: string; value: string };
}
interface PreflightEvent {
  eventCode: string;
  contractCall?: ContractCall;
  balance: string;
  txDetails?: { to?: string; from?: string; value: string | number };
  emitter: Emitter;
  status?: string;
}
interface UpdateNotification {
  (notificationObject: CustomNotificationObject): { dismiss: () => void; update: UpdateNotification };
}
interface ConfigOptions {
  system?: System;
  networkId?: number;
  mobilePosition?: 'bottom' | 'top';
  desktopPosition?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
  darkMode?: boolean;
  txApproveReminderTimeout?: number;
  txStallPendingTimeout?: number;
  txStallConfirmedTimeout?: number;
  notifyMessages?: NotifyMessages;
  clientLocale?: string;
}
interface Hash {
  (hash: string, id?: string): never | { details: BitcoinTransactionLog | EthereumTransactionLog; emitter: Emitter };
}
interface Transaction {
  (options: TransactionOptions): { result: Promise<string>; emitter: Emitter };
}
interface Account {
  (address: string): never | { details: { address: string }; emitter: Emitter };
}
interface Unsubscribe {
  (addressOrHash: string): void;
}
interface Notification {
  (notificationObject: CustomNotificationObject): { dismiss: () => void; update: UpdateNotification };
}
interface Config {
  (options: ConfigOptions): void;
}
interface API {
  hash: Hash;
  transaction: Transaction;
  account: Account;
  unsubscribe: Unsubscribe;
  notification: Notification;
  config: Config;
}
interface EmitterListener {
  (state: TransactionData): boolean | void | CustomNotificationObject;
}
interface Emitter {
  listeners: { [key: string]: EmitterListener };
  on: (eventCode: TransactionEventCode, listener: EmitterListener) => void;
  emit: (state: TransactionData) => boolean | void | CustomNotificationObject;
}
interface NotificationDetails {
  id: string;
  hash?: string;
  startTime: number;
  eventCode: string;
  direction?: string;
  counterparty?: string;
  value?: string;
  asset?: string;
}
declare function init(options: InitOptions): API;
export {
  init as default,
  InitOptions,
  TransactionEvent,
  TransactionEventCode,
  TransactionData,
  NotificationType,
  CustomNotificationObject,
  BitcoinInputOutput,
  NotificationObject,
  ContractCall,
  DecodedContractCall,
  NotifyMessages,
  LocaleMessages,
  TransactionOptions,
  PreflightEvent,
  UpdateNotification,
  ConfigOptions,
  Hash,
  Transaction,
  Account,
  Unsubscribe,
  Notification,
  Config,
  API,
  EmitterListener,
  Emitter,
  NotificationDetails,
};
