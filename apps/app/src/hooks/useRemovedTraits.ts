'use client';

import { useState, useEffect } from 'react';
import type { Contracts } from '@/types/web3';
import useContractReader from './useContractReader';
import { DEGEN_CONTRACT } from '@/constants/contracts';
import { REMOVED_TRAITS_INTERVAL } from '@/constants/index';

export default function useRemovedTraits(readContracts: Contracts): number[] {
  const [removedTraits, setRemovedTraits] = useState<number[]>([]);
  const result = useContractReader(
    readContracts,
    DEGEN_CONTRACT,
    'getRemovedTraits',
    undefined,
    REMOVED_TRAITS_INTERVAL,
  ) as number[];
  useEffect(() => {
    if (result && result.length !== removedTraits.length) setRemovedTraits(result);
  }, [result, removedTraits]);
  return removedTraits.length ? removedTraits : [];
}
