'use client';

import { useEffect, useState } from 'react';
import { CONVERT_TOKEN_TO_USD_URL } from '@/constants/url';

/*
  ~ What it does? ~

  Get rate which convert ETH to NFTL

  ~ How can I use? ~

  const {rate, refetch, loading} = useRateEtherToNFTL();
*/

interface RateEtherToNFTLState {
  rate: number;
  loading: boolean;
  refetch: () => void;
}

export default function useRateEtherToNFTL(): RateEtherToNFTLState {
  const [rate, setRate] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRateEtherToNFTL = async () => {
    try {
      setLoading(true);
      const response = await fetch(CONVERT_TOKEN_TO_USD_URL + 'nifty-league', { method: 'GET' });
      const json = await response.json();
      setRate(json.crypto.eth);
    } catch (err) {
      console.error('Failed to fetch rate', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRateEtherToNFTL();
  }, []);

  return { rate, refetch: fetchRateEtherToNFTL, loading };
}
