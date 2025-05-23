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
} from '../../../../../common';

export interface ERC20PausableInterface extends Interface {
  getFunction(
    nameOrSignature:
      | 'allowance'
      | 'approve'
      | 'balanceOf'
      | 'decimals'
      | 'decreaseAllowance'
      | 'increaseAllowance'
      | 'name'
      | 'paused'
      | 'symbol'
      | 'totalSupply'
      | 'transfer'
      | 'transferFrom',
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: 'Approval' | 'Paused' | 'Transfer' | 'Unpaused'): EventFragment;

  encodeFunctionData(functionFragment: 'allowance', values: [AddressLike, AddressLike]): string;
  encodeFunctionData(functionFragment: 'approve', values: [AddressLike, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'balanceOf', values: [AddressLike]): string;
  encodeFunctionData(functionFragment: 'decimals', values?: undefined): string;
  encodeFunctionData(functionFragment: 'decreaseAllowance', values: [AddressLike, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'increaseAllowance', values: [AddressLike, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'name', values?: undefined): string;
  encodeFunctionData(functionFragment: 'paused', values?: undefined): string;
  encodeFunctionData(functionFragment: 'symbol', values?: undefined): string;
  encodeFunctionData(functionFragment: 'totalSupply', values?: undefined): string;
  encodeFunctionData(functionFragment: 'transfer', values: [AddressLike, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'transferFrom', values: [AddressLike, AddressLike, BigNumberish]): string;

  decodeFunctionResult(functionFragment: 'allowance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'approve', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'balanceOf', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'decimals', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'decreaseAllowance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'increaseAllowance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'name', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'paused', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'symbol', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'totalSupply', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transfer', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transferFrom', data: BytesLike): Result;
}

export namespace ApprovalEvent {
  export type InputTuple = [owner: AddressLike, spender: AddressLike, value: BigNumberish];
  export type OutputTuple = [owner: string, spender: string, value: bigint];
  export interface OutputObject {
    owner: string;
    spender: string;
    value: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PausedEvent {
  export type InputTuple = [account: AddressLike];
  export type OutputTuple = [account: string];
  export interface OutputObject {
    account: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TransferEvent {
  export type InputTuple = [from: AddressLike, to: AddressLike, value: BigNumberish];
  export type OutputTuple = [from: string, to: string, value: bigint];
  export interface OutputObject {
    from: string;
    to: string;
    value: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UnpausedEvent {
  export type InputTuple = [account: AddressLike];
  export type OutputTuple = [account: string];
  export interface OutputObject {
    account: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface ERC20Pausable extends BaseContract {
  connect(runner?: ContractRunner | null): ERC20Pausable;
  waitForDeployment(): Promise<this>;

  interface: ERC20PausableInterface;

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

  allowance: TypedContractMethod<[owner: AddressLike, spender: AddressLike], [bigint], 'view'>;

  approve: TypedContractMethod<[spender: AddressLike, amount: BigNumberish], [boolean], 'nonpayable'>;

  balanceOf: TypedContractMethod<[account: AddressLike], [bigint], 'view'>;

  decimals: TypedContractMethod<[], [bigint], 'view'>;

  decreaseAllowance: TypedContractMethod<
    [spender: AddressLike, subtractedValue: BigNumberish],
    [boolean],
    'nonpayable'
  >;

  increaseAllowance: TypedContractMethod<[spender: AddressLike, addedValue: BigNumberish], [boolean], 'nonpayable'>;

  name: TypedContractMethod<[], [string], 'view'>;

  paused: TypedContractMethod<[], [boolean], 'view'>;

  symbol: TypedContractMethod<[], [string], 'view'>;

  totalSupply: TypedContractMethod<[], [bigint], 'view'>;

  transfer: TypedContractMethod<[to: AddressLike, amount: BigNumberish], [boolean], 'nonpayable'>;

  transferFrom: TypedContractMethod<
    [from: AddressLike, to: AddressLike, amount: BigNumberish],
    [boolean],
    'nonpayable'
  >;

  getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;

  getFunction(
    nameOrSignature: 'allowance',
  ): TypedContractMethod<[owner: AddressLike, spender: AddressLike], [bigint], 'view'>;
  getFunction(
    nameOrSignature: 'approve',
  ): TypedContractMethod<[spender: AddressLike, amount: BigNumberish], [boolean], 'nonpayable'>;
  getFunction(nameOrSignature: 'balanceOf'): TypedContractMethod<[account: AddressLike], [bigint], 'view'>;
  getFunction(nameOrSignature: 'decimals'): TypedContractMethod<[], [bigint], 'view'>;
  getFunction(
    nameOrSignature: 'decreaseAllowance',
  ): TypedContractMethod<[spender: AddressLike, subtractedValue: BigNumberish], [boolean], 'nonpayable'>;
  getFunction(
    nameOrSignature: 'increaseAllowance',
  ): TypedContractMethod<[spender: AddressLike, addedValue: BigNumberish], [boolean], 'nonpayable'>;
  getFunction(nameOrSignature: 'name'): TypedContractMethod<[], [string], 'view'>;
  getFunction(nameOrSignature: 'paused'): TypedContractMethod<[], [boolean], 'view'>;
  getFunction(nameOrSignature: 'symbol'): TypedContractMethod<[], [string], 'view'>;
  getFunction(nameOrSignature: 'totalSupply'): TypedContractMethod<[], [bigint], 'view'>;
  getFunction(
    nameOrSignature: 'transfer',
  ): TypedContractMethod<[to: AddressLike, amount: BigNumberish], [boolean], 'nonpayable'>;
  getFunction(
    nameOrSignature: 'transferFrom',
  ): TypedContractMethod<[from: AddressLike, to: AddressLike, amount: BigNumberish], [boolean], 'nonpayable'>;

  getEvent(
    key: 'Approval',
  ): TypedContractEvent<ApprovalEvent.InputTuple, ApprovalEvent.OutputTuple, ApprovalEvent.OutputObject>;
  getEvent(
    key: 'Paused',
  ): TypedContractEvent<PausedEvent.InputTuple, PausedEvent.OutputTuple, PausedEvent.OutputObject>;
  getEvent(
    key: 'Transfer',
  ): TypedContractEvent<TransferEvent.InputTuple, TransferEvent.OutputTuple, TransferEvent.OutputObject>;
  getEvent(
    key: 'Unpaused',
  ): TypedContractEvent<UnpausedEvent.InputTuple, UnpausedEvent.OutputTuple, UnpausedEvent.OutputObject>;

  filters: {
    'Approval(address,address,uint256)': TypedContractEvent<
      ApprovalEvent.InputTuple,
      ApprovalEvent.OutputTuple,
      ApprovalEvent.OutputObject
    >;
    Approval: TypedContractEvent<ApprovalEvent.InputTuple, ApprovalEvent.OutputTuple, ApprovalEvent.OutputObject>;

    'Paused(address)': TypedContractEvent<PausedEvent.InputTuple, PausedEvent.OutputTuple, PausedEvent.OutputObject>;
    Paused: TypedContractEvent<PausedEvent.InputTuple, PausedEvent.OutputTuple, PausedEvent.OutputObject>;

    'Transfer(address,address,uint256)': TypedContractEvent<
      TransferEvent.InputTuple,
      TransferEvent.OutputTuple,
      TransferEvent.OutputObject
    >;
    Transfer: TypedContractEvent<TransferEvent.InputTuple, TransferEvent.OutputTuple, TransferEvent.OutputObject>;

    'Unpaused(address)': TypedContractEvent<
      UnpausedEvent.InputTuple,
      UnpausedEvent.OutputTuple,
      UnpausedEvent.OutputObject
    >;
    Unpaused: TypedContractEvent<UnpausedEvent.InputTuple, UnpausedEvent.OutputTuple, UnpausedEvent.OutputObject>;
  };
}
