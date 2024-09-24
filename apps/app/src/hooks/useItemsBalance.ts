'use client';

import { useEffect, useState } from 'react';
import type { AddressLike } from 'ethers6';
import type { Contracts } from '@/types/web3';
import type { Item } from '@/types/marketplace';
import { MARKETPLACE_CONTRACT } from '@/constants/contracts';
import { ITEMS } from '@/constants/marketplace';

/*
  ~ What it does? ~

  Gets your Items NFTs balance from Immutable zkEVM

  ~ How can I use? ~

  const { itemsBalance } = useItemsBalance(imxContracts, address);
*/

export default function useItemsBalance(
  imxContracts: Contracts,
  address?: `0x${string}`,
  refreshKey = 0,
): {
  itemsBalance: Item[];
  loading: boolean;
} {
  const [loading, setLoading] = useState(true);
  const [itemsBalance, setItemsBal] = useState<Item[]>([]);

  useEffect(() => {
    async function checkUserItems() {
      const ownerArr = [address, address, address, address, address, address] as AddressLike[];
      const comicIds = [101, 102, 103, 104, 105, 106];
      const comicsData = await imxContracts[MARKETPLACE_CONTRACT].balanceOfBatch(ownerArr, comicIds);
      setItemsBal(
        comicsData.map((c: bigint, i: number) => ({
          ...(ITEMS[i] as Item),
          balance: Number(c),
        })),
      );
      setLoading(false);
    }
    if (!address) {
      setLoading(false);
      setItemsBal([]);
    }

    if (address && imxContracts && imxContracts[MARKETPLACE_CONTRACT]) {
      // eslint-disable-next-line no-void
      void checkUserItems();
    }
  }, [address, imxContracts, refreshKey]);

  return { itemsBalance, loading };
}
