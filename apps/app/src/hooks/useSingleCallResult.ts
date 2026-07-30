'use client'
import { useState, useEffect } from 'react'
import type { BaseContract, Contract, ContractMethod } from 'ethers'
import type { Contracts } from '@/types/web3'

export default function useSingleCallResult(
  contracts: Contracts,
  contractName: keyof Contracts,
  functionName: string,
  args: unknown[],
  formatter: ((arg0: unknown) => void) | null,
  skip: boolean
): unknown {
  const [value, setValue] = useState<unknown>()

  useEffect(() => {
    const callContract = async (contract: Contract) => {
      try {
        let newValue: unknown
        if (args && args.length > 0) {
          newValue = await (contract[functionName] as ContractMethod)(...args)
        } else {
          newValue = await (contract[functionName] as ContractMethod)()
        }
        if (formatter && typeof formatter === 'function') {
          newValue = formatter(newValue)
        }
        setValue(newValue)
      } catch (e) {
        console.error(e)
      }
    }
    if (contracts && contracts[contractName] && !skip)
      void callContract(contracts[contractName] as BaseContract as Contract)
  }, [args, contractName, contracts, formatter, functionName, skip, value])

  return value
}
