'use client';

import type { Contracts } from '@/types/web3';
import useContractReader from './useContractReader';
import { DEGEN_CONTRACT } from '@/constants/contracts';
import { REMOVED_TRAITS_INTERVAL } from '@/constants/index';

export default function useRemovedTraits(readContracts: Contracts): number[] {
  const result = useContractReader(
    readContracts,
    DEGEN_CONTRACT,
    'getRemovedTraits',
    undefined,
    REMOVED_TRAITS_INTERVAL,
  ) as number[] | undefined;
  return result || [];
}
