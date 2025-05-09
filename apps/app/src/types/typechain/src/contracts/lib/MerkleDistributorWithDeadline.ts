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

export interface MerkleDistributorWithDeadlineInterface extends Interface {
  getFunction(
    nameOrSignature:
      | 'claim'
      | 'endTime'
      | 'isClaimed'
      | 'merkleRoot'
      | 'owner'
      | 'renounceOwnership'
      | 'token'
      | 'transferOwnership'
      | 'withdraw',
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: 'Claimed' | 'OwnershipTransferred'): EventFragment;

  encodeFunctionData(functionFragment: 'claim', values: [BigNumberish, AddressLike, BigNumberish, BytesLike[]]): string;
  encodeFunctionData(functionFragment: 'endTime', values?: undefined): string;
  encodeFunctionData(functionFragment: 'isClaimed', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'merkleRoot', values?: undefined): string;
  encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
  encodeFunctionData(functionFragment: 'renounceOwnership', values?: undefined): string;
  encodeFunctionData(functionFragment: 'token', values?: undefined): string;
  encodeFunctionData(functionFragment: 'transferOwnership', values: [AddressLike]): string;
  encodeFunctionData(functionFragment: 'withdraw', values?: undefined): string;

  decodeFunctionResult(functionFragment: 'claim', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'endTime', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'isClaimed', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'merkleRoot', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'renounceOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'token', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transferOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdraw', data: BytesLike): Result;
}

export namespace ClaimedEvent {
  export type InputTuple = [index: BigNumberish, account: AddressLike, amount: BigNumberish];
  export type OutputTuple = [index: bigint, account: string, amount: bigint];
  export interface OutputObject {
    index: bigint;
    account: string;
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

export interface MerkleDistributorWithDeadline extends BaseContract {
  connect(runner?: ContractRunner | null): MerkleDistributorWithDeadline;
  waitForDeployment(): Promise<this>;

  interface: MerkleDistributorWithDeadlineInterface;

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

  claim: TypedContractMethod<
    [index: BigNumberish, account: AddressLike, amount: BigNumberish, merkleProof: BytesLike[]],
    [void],
    'nonpayable'
  >;

  endTime: TypedContractMethod<[], [bigint], 'view'>;

  isClaimed: TypedContractMethod<[index: BigNumberish], [boolean], 'view'>;

  merkleRoot: TypedContractMethod<[], [string], 'view'>;

  owner: TypedContractMethod<[], [string], 'view'>;

  renounceOwnership: TypedContractMethod<[], [void], 'nonpayable'>;

  token: TypedContractMethod<[], [string], 'view'>;

  transferOwnership: TypedContractMethod<[newOwner: AddressLike], [void], 'nonpayable'>;

  withdraw: TypedContractMethod<[], [void], 'nonpayable'>;

  getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;

  getFunction(
    nameOrSignature: 'claim',
  ): TypedContractMethod<
    [index: BigNumberish, account: AddressLike, amount: BigNumberish, merkleProof: BytesLike[]],
    [void],
    'nonpayable'
  >;
  getFunction(nameOrSignature: 'endTime'): TypedContractMethod<[], [bigint], 'view'>;
  getFunction(nameOrSignature: 'isClaimed'): TypedContractMethod<[index: BigNumberish], [boolean], 'view'>;
  getFunction(nameOrSignature: 'merkleRoot'): TypedContractMethod<[], [string], 'view'>;
  getFunction(nameOrSignature: 'owner'): TypedContractMethod<[], [string], 'view'>;
  getFunction(nameOrSignature: 'renounceOwnership'): TypedContractMethod<[], [void], 'nonpayable'>;
  getFunction(nameOrSignature: 'token'): TypedContractMethod<[], [string], 'view'>;
  getFunction(nameOrSignature: 'transferOwnership'): TypedContractMethod<[newOwner: AddressLike], [void], 'nonpayable'>;
  getFunction(nameOrSignature: 'withdraw'): TypedContractMethod<[], [void], 'nonpayable'>;

  getEvent(
    key: 'Claimed',
  ): TypedContractEvent<ClaimedEvent.InputTuple, ClaimedEvent.OutputTuple, ClaimedEvent.OutputObject>;
  getEvent(
    key: 'OwnershipTransferred',
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;

  filters: {
    'Claimed(uint256,address,uint256)': TypedContractEvent<
      ClaimedEvent.InputTuple,
      ClaimedEvent.OutputTuple,
      ClaimedEvent.OutputObject
    >;
    Claimed: TypedContractEvent<ClaimedEvent.InputTuple, ClaimedEvent.OutputTuple, ClaimedEvent.OutputObject>;

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
