'use client';

import { useEffect, useMemo, useState } from 'react';
import type { AddressLike } from 'ethers6';
import type { Contracts } from '@/types/web3';
import type { Comic } from '@/types/marketplace';
import { MARKETPLACE_CONTRACT } from '@/constants/contracts';
import { COMICS } from '@/constants/marketplace';

/*
  ~ What it does? ~

  Gets your Comics NFTs balance from Immutable zkEVM

  ~ How can I use? ~

  const { comicsBalance } = useComicsBalance(imxContracts, address);
*/

export default function useComicsBalance(
  imxContracts: Contracts,
  address?: `0x${string}`,
  refreshKey = 0,
): {
  comicsBalance: Comic[];
  loading: boolean;
} {
  const [loading, setLoading] = useState(true);
  const [comicsBalance, setComicsBal] = useState<Comic[]>([]);
  const marketplaceContract = useMemo(() => imxContracts[MARKETPLACE_CONTRACT], [imxContracts]);

  useEffect(() => {
    async function checkUserComics() {
      const ownerArr = [address, address, address, address, address, address] as AddressLike[];
      const comicIds = [1, 2, 3, 4, 5, 6];
      const comicsData = await marketplaceContract.balanceOfBatch(ownerArr, comicIds);

      if (comicsData.some((c: bigint) => c > 0)) {
        setComicsBal(
          comicsData.map((c: bigint, i: number) => ({
            ...(COMICS[i] as Comic),
            balance: Number(c),
          })),
        );
      }
      setLoading(false);
    }

    if (address && marketplaceContract) {
      // eslint-disable-next-line no-void
      void checkUserComics();
    }
  }, [address, marketplaceContract, refreshKey]);

  return { comicsBalance, loading };
}
