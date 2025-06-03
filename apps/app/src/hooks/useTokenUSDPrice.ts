'use client';

import { useCallback, useEffect, useState } from 'react';
import { CONVERT_TOKEN_TO_USD_URL } from '@/constants/url';

/*
  ~ What it does? ~

  Get USD price of token

  ~ How can I use? ~

  const {price, refetch, loading} = useTokenUSDPrice();
*/

interface useTokenUSDPriceProps {
  slug: string;
}

interface TokenUSDPriceState {
  price: number;
  loading: boolean;
  refetch: () => void;
}

export default function useTokenUSDPrice({ slug }: useTokenUSDPriceProps): TokenUSDPriceState {
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTokenUSDPrice = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(CONVERT_TOKEN_TO_USD_URL + slug, { method: 'GET' });
      const json = await response.json();
      setPrice(json.fiat.usd);
    } catch (err) {
      console.error('Failed to fetch price', err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchTokenUSDPrice();
  }, [fetchTokenUSDPrice]);

  return { price, refetch: fetchTokenUSDPrice, loading };
}
