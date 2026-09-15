'use client'

import { createSignal, type Accessor } from 'solid-js'
import type { Contracts } from '@/types/web3'
import type { BaseContract, Contract, ContractMethod } from 'ethers'
import { areValuesEqual } from '@/utils/value-equality'
import useAsyncInterval from './useAsyncInterval'

/*
  Enables you to read values from contracts and keep track of them in the local React states

  ~ How can I use? ~

  const purpose = useContractReader(readContracts,"YourContract", "purpose")

  ~ Features ~

  - Provide readContracts by loading contracts from useContractLoader
  - Specify the name of the target contract
  - Specify the name of the function name to call from the contract
  - Pass in any args necessary
  - Provide a formatter to format the result
  - Provide a refreshKey if you wish to manually trigger a refetch
*/

export default function useContractReader(
  contracts: Contracts | Accessor<Contracts>,
  contractName: keyof Contracts,
  functionName: string,
  args?: unknown[],
  pollTime?: number,
  formatter?: (value: unknown) => void,
  refreshKey?: string | number,
  skip: boolean = false
): Accessor<unknown> {
  const [value, setValue] = createSignal<unknown>()
  const resolveContracts = () => (typeof contracts === 'function' ? contracts() : contracts)
  // args are compared by serialization so a new-but-equivalent array does not
  // restart the polling interval.
  const argsKey = JSON.stringify(args)

  const readContract = async () => {
    const activeContracts = resolveContracts()
    if (!skip && activeContracts && activeContracts[contractName]) {
      try {
        let newValue
        const contract = activeContracts[contractName] as BaseContract as Contract
        if (contract) {
          const fn = contract[functionName] as ContractMethod
          if (fn && args && args.length > 0) {
            newValue = await fn(...args)
          } else if (fn) {
            newValue = await fn()
          }
        }
        if (formatter && typeof formatter === 'function') newValue = formatter(newValue)
        if (!areValuesEqual(newValue, value())) setValue(() => newValue)
        return
      } catch (e) {
        console.error('Read Contract Error:', contractName, e)
      }
    }
    return
  }

  useAsyncInterval(readContract, pollTime, true, argsKey, refreshKey)

  return value
}
