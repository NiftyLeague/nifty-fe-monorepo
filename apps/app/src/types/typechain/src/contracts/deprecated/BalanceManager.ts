/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from 'ethers6';
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from '../../../common';

export interface BalanceManagerInterface extends Interface {
  getFunction(
    nameOrSignature:
      | 'deposit'
      | 'initialize'
      | 'maintainer'
      | 'nftl'
      | 'nonce'
      | 'owner'
      | 'renounceOwnership'
      | 'signatures'
      | 'transferOwnership'
      | 'updateMaintainer'
      | 'withdraw'
      | 'withdrawByDAO',
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | 'Initialized'
      | 'MaintainerUpdated'
      | 'NFTLDeposited'
      | 'NFTLWithdrawn'
      | 'NFTLWithdrawnByDAO'
      | 'OwnershipTransferred',
  ): EventFragment;

  encodeFunctionData(functionFragment: 'deposit', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'initialize', values: [AddressLike, AddressLike]): string;
  encodeFunctionData(functionFragment: 'maintainer', values?: undefined): string;
  encodeFunctionData(functionFragment: 'nftl', values?: undefined): string;
  encodeFunctionData(functionFragment: 'nonce', values: [AddressLike]): string;
  encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
  encodeFunctionData(functionFragment: 'renounceOwnership', values?: undefined): string;
  encodeFunctionData(functionFragment: 'signatures', values: [BytesLike]): string;
  encodeFunctionData(functionFragment: 'transferOwnership', values: [AddressLike]): string;
  encodeFunctionData(functionFragment: 'updateMaintainer', values: [AddressLike]): string;
  encodeFunctionData(
    functionFragment: 'withdraw',
    values: [BigNumberish, BigNumberish, BigNumberish, BytesLike],
  ): string;
  encodeFunctionData(functionFragment: 'withdrawByDAO', values: [AddressLike, BigNumberish]): string;

  decodeFunctionResult(functionFragment: 'deposit', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'initialize', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'maintainer', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'nftl', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'nonce', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'renounceOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'signatures', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transferOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'updateMaintainer', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdraw', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdrawByDAO', data: BytesLike): Result;
}

export namespace InitializedEvent {
  export type InputTuple = [version: BigNumberish];
  export type OutputTuple = [version: bigint];
  export interface OutputObject {
    version: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace MaintainerUpdatedEvent {
  export type InputTuple = [by: AddressLike, oldMaintainer: AddressLike, newMaintainer: AddressLike];
  export type OutputTuple = [by: string, oldMaintainer: string, newMaintainer: string];
  export interface OutputObject {
    by: string;
    oldMaintainer: string;
    newMaintainer: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace NFTLDepositedEvent {
  export type InputTuple = [by: AddressLike, amount: BigNumberish];
  export type OutputTuple = [by: string, amount: bigint];
  export interface OutputObject {
    by: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace NFTLWithdrawnEvent {
  export type InputTuple = [by: AddressLike, beneficiary: AddressLike, amount: BigNumberish];
  export type OutputTuple = [by: string, beneficiary: string, amount: bigint];
  export interface OutputObject {
    by: string;
    beneficiary: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace NFTLWithdrawnByDAOEvent {
  export type InputTuple = [by: AddressLike, beneficiary: AddressLike, amount: BigNumberish];
  export type OutputTuple = [by: string, beneficiary: string, amount: bigint];
  export interface OutputObject {
    by: string;
    beneficiary: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface BalanceManager extends BaseContract {
  connect(runner?: ContractRunner | null): BalanceManager;
  waitForDeployment(): Promise<this>;

  interface: BalanceManagerInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>,
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>,
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;

  deposit: TypedContractMethod<[_amount: BigNumberish], [void], 'nonpayable'>;

  initialize: TypedContractMethod<[_nftl: AddressLike, _maintainer: AddressLike], [void], 'nonpayable'>;

  maintainer: TypedContractMethod<[], [string], 'view'>;

  nftl: TypedContractMethod<[], [string], 'view'>;

  nonce: TypedContractMethod<[user: AddressLike], [bigint], 'view'>;

  owner: TypedContractMethod<[], [string], 'view'>;

  renounceOwnership: TypedContractMethod<[], [void], 'nonpayable'>;

  signatures: TypedContractMethod<[signature: BytesLike], [boolean], 'view'>;

  transferOwnership: TypedContractMethod<[newOwner: AddressLike], [void], 'nonpayable'>;

  updateMaintainer: TypedContractMethod<[_maintainer: AddressLike], [void], 'nonpayable'>;

  withdraw: TypedContractMethod<
    [_amount: BigNumberish, _nonce: BigNumberish, _expireAt: BigNumberish, _signature: BytesLike],
    [void],
    'nonpayable'
  >;

  withdrawByDAO: TypedContractMethod<[_beneficiary: AddressLike, _amount: BigNumberish], [void], 'nonpayable'>;

  getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;

  getFunction(nameOrSignature: 'deposit'): TypedContractMethod<[_amount: BigNumberish], [void], 'nonpayable'>;
  getFunction(
    nameOrSignature: 'initialize',
  ): TypedContractMethod<[_nftl: AddressLike, _maintainer: AddressLike], [void], 'nonpayable'>;
  getFunction(nameOrSignature: 'maintainer'): TypedContractMethod<[], [string], 'view'>;
  getFunction(nameOrSignature: 'nftl'): TypedContractMethod<[], [string], 'view'>;
  getFunction(nameOrSignature: 'nonce'): TypedContractMethod<[user: AddressLike], [bigint], 'view'>;
  getFunction(nameOrSignature: 'owner'): TypedContractMethod<[], [string], 'view'>;
  getFunction(nameOrSignature: 'renounceOwnership'): TypedContractMethod<[], [void], 'nonpayable'>;
  getFunction(nameOrSignature: 'signatures'): TypedContractMethod<[signature: BytesLike], [boolean], 'view'>;
  getFunction(nameOrSignature: 'transferOwnership'): TypedContractMethod<[newOwner: AddressLike], [void], 'nonpayable'>;
  getFunction(
    nameOrSignature: 'updateMaintainer',
  ): TypedContractMethod<[_maintainer: AddressLike], [void], 'nonpayable'>;
  getFunction(
    nameOrSignature: 'withdraw',
  ): TypedContractMethod<
    [_amount: BigNumberish, _nonce: BigNumberish, _expireAt: BigNumberish, _signature: BytesLike],
    [void],
    'nonpayable'
  >;
  getFunction(
    nameOrSignature: 'withdrawByDAO',
  ): TypedContractMethod<[_beneficiary: AddressLike, _amount: BigNumberish], [void], 'nonpayable'>;

  getEvent(
    key: 'Initialized',
  ): TypedContractEvent<InitializedEvent.InputTuple, InitializedEvent.OutputTuple, InitializedEvent.OutputObject>;
  getEvent(
    key: 'MaintainerUpdated',
  ): TypedContractEvent<
    MaintainerUpdatedEvent.InputTuple,
    MaintainerUpdatedEvent.OutputTuple,
    MaintainerUpdatedEvent.OutputObject
  >;
  getEvent(
    key: 'NFTLDeposited',
  ): TypedContractEvent<NFTLDepositedEvent.InputTuple, NFTLDepositedEvent.OutputTuple, NFTLDepositedEvent.OutputObject>;
  getEvent(
    key: 'NFTLWithdrawn',
  ): TypedContractEvent<NFTLWithdrawnEvent.InputTuple, NFTLWithdrawnEvent.OutputTuple, NFTLWithdrawnEvent.OutputObject>;
  getEvent(
    key: 'NFTLWithdrawnByDAO',
  ): TypedContractEvent<
    NFTLWithdrawnByDAOEvent.InputTuple,
    NFTLWithdrawnByDAOEvent.OutputTuple,
    NFTLWithdrawnByDAOEvent.OutputObject
  >;
  getEvent(
    key: 'OwnershipTransferred',
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;

  filters: {
    'Initialized(uint8)': TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;
    Initialized: TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;

    'MaintainerUpdated(address,address,address)': TypedContractEvent<
      MaintainerUpdatedEvent.InputTuple,
      MaintainerUpdatedEvent.OutputTuple,
      MaintainerUpdatedEvent.OutputObject
    >;
    MaintainerUpdated: TypedContractEvent<
      MaintainerUpdatedEvent.InputTuple,
      MaintainerUpdatedEvent.OutputTuple,
      MaintainerUpdatedEvent.OutputObject
    >;

    'NFTLDeposited(address,uint256)': TypedContractEvent<
      NFTLDepositedEvent.InputTuple,
      NFTLDepositedEvent.OutputTuple,
      NFTLDepositedEvent.OutputObject
    >;
    NFTLDeposited: TypedContractEvent<
      NFTLDepositedEvent.InputTuple,
      NFTLDepositedEvent.OutputTuple,
      NFTLDepositedEvent.OutputObject
    >;

    'NFTLWithdrawn(address,address,uint256)': TypedContractEvent<
      NFTLWithdrawnEvent.InputTuple,
      NFTLWithdrawnEvent.OutputTuple,
      NFTLWithdrawnEvent.OutputObject
    >;
    NFTLWithdrawn: TypedContractEvent<
      NFTLWithdrawnEvent.InputTuple,
      NFTLWithdrawnEvent.OutputTuple,
      NFTLWithdrawnEvent.OutputObject
    >;

    'NFTLWithdrawnByDAO(address,address,uint256)': TypedContractEvent<
      NFTLWithdrawnByDAOEvent.InputTuple,
      NFTLWithdrawnByDAOEvent.OutputTuple,
      NFTLWithdrawnByDAOEvent.OutputObject
    >;
    NFTLWithdrawnByDAO: TypedContractEvent<
      NFTLWithdrawnByDAOEvent.InputTuple,
      NFTLWithdrawnByDAOEvent.OutputTuple,
      NFTLWithdrawnByDAOEvent.OutputObject
    >;

    'OwnershipTransferred(address,address)': TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
  };
}