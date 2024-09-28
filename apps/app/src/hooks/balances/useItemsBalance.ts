'use client';

import { useEffect, useMemo, useState } from 'react';
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
  const marketplaceContract = useMemo(() => imxContracts[MARKETPLACE_CONTRACT], [imxContracts]);

  useEffect(() => {
    async function checkUserItems() {
      const ownerArr = [address, address, address, address, address, address, address] as AddressLike[];
      const itemIds = [101, 102, 103, 104, 105, 106, 107];
      const itemsData = await marketplaceContract.balanceOfBatch(ownerArr, itemIds);

      if (itemsData.some((c: bigint) => c > 0)) {
        setItemsBal(
          itemsData.map((c: bigint, i: number) => ({
            ...(ITEMS[i] as Item),
            balance: Number(c),
          })),
        );
      }
      setLoading(false);
    }

    if (address && marketplaceContract) {
      // eslint-disable-next-line no-void
      void checkUserItems();
    }
  }, [address, marketplaceContract, refreshKey]);

  return { itemsBalance, loading };
}
