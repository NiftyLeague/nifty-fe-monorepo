'use client';

/* eslint-disable no-console */
import { useCallback, useState, useMemo } from 'react';
import isEqual from 'lodash/isEqual';
import type { Contracts } from '@/types/web3';
import type { BaseContract, Contract, ContractMethod } from 'ethers';
import useAsyncInterval from './useAsyncInterval';

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
  contracts: Contracts,
  contractName: keyof Contracts,
  functionName: string,
  args?: unknown[],
  pollTime?: number,
  formatter?: (value: unknown) => void,
  refreshKey?: string | number,
  skip: boolean = false,
): unknown {
  const [value, setValue] = useState();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const argsMemoized = useMemo(() => args, [JSON.stringify(args)]);

  const readContract = useCallback(async () => {
    if (!skip && contracts && contracts[contractName]) {
      try {
        let newValue;
        const contract = contracts[contractName] as BaseContract as Contract;
        if (contract) {
          const fn = contract[functionName] as ContractMethod;
          if (fn && args && args.length > 0) {
            newValue = await fn(...args);
          } else if (fn) {
            newValue = await fn();
          }
        }
        if (formatter && typeof formatter === 'function') newValue = formatter(newValue);
        if (!isEqual(newValue, value)) setValue(newValue);
        return;
      } catch (e) {
        console.error('Read Contract Error:', contractName, e);
      }
    }
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [argsMemoized, contractName, contracts, formatter, functionName, refreshKey, skip, value]);

  useAsyncInterval(readContract, pollTime, true, JSON.stringify(args));

  return value;
}
