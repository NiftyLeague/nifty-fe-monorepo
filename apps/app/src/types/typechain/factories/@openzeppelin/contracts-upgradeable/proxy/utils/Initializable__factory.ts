/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from 'ethers6';
import type {
  Initializable,
  InitializableInterface,
} from '../../../../../@openzeppelin/contracts-upgradeable/proxy/utils/Initializable';

const _abi = [
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'uint8', name: 'version', type: 'uint8' }],
    name: 'Initialized',
    type: 'event',
  },
] as const;

export class Initializable__factory {
  static readonly abi = _abi;
  static createInterface(): InitializableInterface {
    return new Interface(_abi) as InitializableInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Initializable {
    return new Contract(address, _abi, runner) as unknown as Initializable;
  }
}
