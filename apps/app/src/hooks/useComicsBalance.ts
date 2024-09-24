'use client';

import { useEffect, useState } from 'react';
import useNetworkContext from '@/hooks/useNetworkContext';
import { COMICS_CONTRACT } from '@/constants/contracts';
import { COMICS } from '@/constants/comics';
import type { Comic } from '@/types/comic';
import type { AddressLike } from 'ethers6';

/*
  ~ What it does? ~

  Gets your comics NFT balance

  ~ How can I use? ~

  const yourBalance = useComicsBalance();
*/

export default function useComicsBalance(refreshKey = 0): {
  comicsBalance: Comic[];
  loading: boolean;
} {
  const [loading, setLoading] = useState(true);
  const [comicsBalance, setComicsBal] = useState<Comic[]>([]);
  const { address, readContracts } = useNetworkContext();

  useEffect(() => {
    async function checkUserComics() {
      const ownerArr = [address, address, address, address, address, address] as AddressLike[];
      const comicIds = [1, 2, 3, 4, 5, 6];
      const comicsData = await readContracts[COMICS_CONTRACT].balanceOfBatch(ownerArr, comicIds);
      setComicsBal(
        comicsData.map((c: bigint, i: number) => ({
          ...(COMICS[i] as Comic),
          balance: Number(c),
        })),
      );
      setLoading(false);
    }
    if (!address) {
      setLoading(false);
      setComicsBal([]);
    }

    if (address && readContracts && readContracts[COMICS_CONTRACT]) {
      // eslint-disable-next-line no-void
      void checkUserComics();
    }
  }, [address, readContracts, refreshKey]);

  return { comicsBalance, loading };
}
