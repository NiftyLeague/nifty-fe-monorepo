import { useMemo } from 'react';
import groupBy from 'lodash/groupBy';
import { ITEMS } from '@/constants/comics';
import { ImmutableMethodResults } from '@imtbl/imx-sdk';
import type { Item } from '@/types/comic';

/*
  ~ What it does? ~

  Gets your IMX items NFT balances from inventory

  ~ How can I use? ~

  const yourBalance = useItemsBalance(inventory);
*/

export default function useItemsBalance(inventory: ImmutableMethodResults.ImmutableGetAssetsResult): {
  itemsBalance: Item[];
} {
  const itemsBalance: Item[] = useMemo(() => {
    if (inventory?.result) {
      const groupBalances: { item_id?: number; balance: number }[] = Object.values(
        groupBy(inventory.result, 'metadata.item_id'),
      ).map((group: { metadata?: unknown }[]) => ({
        ...(group[0]?.metadata || {}),
        balance: group.length,
      }));

      return ITEMS.map(item => ({
        ...item,
        ...(groupBalances.find(g => g.item_id === item.id) || {}),
      }));
    }
    return [];
  }, [inventory]);

  return { itemsBalance };
}
