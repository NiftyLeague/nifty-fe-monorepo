import { createSignal, createEffect, type Accessor } from 'solid-js'
import type { BaseContract, Contract, ContractMethod } from 'ethers'
import type { Contracts } from '@/types/web3'

type MaybeAccessor<T> = T | Accessor<T>
const resolve = <T>(value: MaybeAccessor<T>): T =>
  typeof value === 'function' ? (value as Accessor<T>)() : value

export default function useSingleCallResult(
  contracts: MaybeAccessor<Contracts | undefined>,
  contractName: keyof Contracts,
  functionName: string,
  args: MaybeAccessor<unknown[]>,
  formatter: ((arg0: unknown) => void) | null,
  skip: MaybeAccessor<boolean>
): Accessor<unknown> {
  const [value, setValue] = createSignal<unknown>()

  createEffect(() => {
    const resolvedContracts = resolve(contracts)
    const resolvedArgs = resolve(args)
    const resolvedSkip = resolve(skip)
    const contract = resolvedContracts?.[contractName] as BaseContract as Contract | undefined

    if (!contract || resolvedSkip) return

    let cancelled = false
    const callContract = async () => {
      try {
        let newValue: unknown
        if (resolvedArgs && resolvedArgs.length > 0) {
          newValue = await (contract[functionName] as ContractMethod)(...resolvedArgs)
        } else {
          newValue = await (contract[functionName] as ContractMethod)()
        }
        if (formatter && typeof formatter === 'function') {
          newValue = formatter(newValue)
        }
        if (!cancelled) setValue(() => newValue)
      } catch (e) {
        console.error(e)
      }
    }
    void callContract()
    return () => {
      cancelled = true
    }
  })

  return value
}
