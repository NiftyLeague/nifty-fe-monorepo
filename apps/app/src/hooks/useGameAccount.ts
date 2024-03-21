'use client';

import { useQuery } from '@tanstack/react-query';
import { GAMER_ACCOUNT_API } from '@/constants/url';
import type { Account } from '@/types/account';
import { AUTH_Token } from '@/types/auth';
import useAuth from './useAuth';

interface GameAccountState {
  account: Account | undefined;
  accountError: Error | null;
  loadingAccount: boolean;
  refetchAccount: () => void;
}

const fetchGameAccount = async (authToken: AUTH_Token) => {
  const response = await fetch(GAMER_ACCOUNT_API, {
    method: 'GET',
    headers: { authorizationToken: authToken || '' },
  });
  const body = await response.json();
  return body;
};

const useGameAccount = (): GameAccountState => {
  const { authToken, isLoggedIn } = useAuth();
  const { data, isLoading, error, refetch } = useQuery<Account>({
    queryKey: ['game-account'],
    queryFn: () => fetchGameAccount(authToken),
    enabled: !!authToken && isLoggedIn,
  });

  return { account: data, accountError: error, loadingAccount: isLoading, refetchAccount: refetch };
};

export default useGameAccount;
