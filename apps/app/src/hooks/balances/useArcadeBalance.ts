'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GET_ARCADE_TOKEN_BALANCE_API } from '@/constants/url';
import { AUTH_Token } from '@/types/auth';
import useAuth from '@/hooks/useAuth';

/*
  ~ What it does? ~

  Gets your arcade balance

  ~ How can I use? ~

  const { balance, error, loading, refetch } = useArcadeBalance();
*/

interface ArcadeBalanceInfo {
  updated_at: number;
  balance_used: number;
  balance: number;
  user_id: string;
  item_id: string;
}

interface ArcadeBalanceState {
  balance: number;
  error: Error | null;
  loading: boolean;
  refetch: () => void;
}

const fetchArcadeTokenBalance = async (authToken: AUTH_Token) => {
  const response = await fetch(GET_ARCADE_TOKEN_BALANCE_API, {
    method: 'GET',
    headers: { authorizationToken: authToken || '' },
  });
  const body = await response.json();
  return body;
};

export default function useArcadeBalance(): ArcadeBalanceState {
  const { authToken, isLoggedIn } = useAuth();
  const { data, isLoading, error, refetch } = useQuery<ArcadeBalanceInfo>({
    queryKey: ['arcade-token-balance'],
    queryFn: () => fetchArcadeTokenBalance(authToken),
    enabled: !!authToken && isLoggedIn,
  });

  const balance = useMemo(() => data?.balance ?? 0, [data]);

  return { balance, error, loading: isLoading, refetch };
}
