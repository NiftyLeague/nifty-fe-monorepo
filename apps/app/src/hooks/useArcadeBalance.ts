import { useCallback, useEffect, useMemo, useState } from 'react';
import { GET_ARCADE_TOKEN_BALANCE_API } from '@/constants/url';
import useAuth from './useAuth';

/*
  ~ What it does? ~

  Gets your arcade balance

  ~ How can I use? ~

  const { arcadeBalance, refetch, loading } = useArcadeBalance();
*/

interface ArcadeBalanceInfo {
  updated_at: number;
  balance_used: number;
  balance: number;
  user_id: string;
  item_id: string;
}

interface ArcadeBalanceState {
  arcadeBalance: number;
  loading: boolean;
  refetch: () => void;
}

export default function useArcadeBalance(): ArcadeBalanceState {
  const [balanceRes, setBalanceRes] = useState<ArcadeBalanceInfo | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const { authToken, isLoggedIn } = useAuth();

  const fetchBalance = useCallback(async () => {
    try {
      if (!authToken || !isLoggedIn) return;
      setLoading(true);
      const res = await fetch(GET_ARCADE_TOKEN_BALANCE_API, {
        headers: { authorizationToken: authToken },
      });
      if (res.status === 200) {
        const json = await res.json();
        if (json) setBalanceRes(json);
        else setBalanceRes(undefined);
      }
    } catch (err) {
      console.error('Failed to fetch balance', err);
    } finally {
      setLoading(false);
    }
  }, [authToken, isLoggedIn]);

  // useEffect(() => {
  //   if (isLoggedIn && !balanceRes) {
  //     fetchBalance();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [balanceRes, isLoggedIn]);

  const arcadeBalance = useMemo(() => balanceRes?.balance ?? 0, [balanceRes]);

  return {
    arcadeBalance,
    refetch: fetchBalance,
    loading,
  };
}
