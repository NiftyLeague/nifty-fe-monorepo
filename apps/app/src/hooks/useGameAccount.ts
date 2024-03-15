'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { GAMER_ACCOUNT_API } from '@/constants/url';
import type { Account } from '@/types/account';
import useAuth from './useAuth';

const useGameAccount = (refreshKey?: string | number): { error: boolean; account: Account | undefined } => {
  const firstRenderRef = useRef(true);
  const [account, setAccount] = useState<Account | undefined>(undefined);
  const [error, setAccError] = useState(false);
  const { authToken } = useAuth();

  const fetchAccount = useCallback(async () => {
    if (!authToken) {
      return;
    }
    try {
      const res = await fetch(GAMER_ACCOUNT_API, {
        headers: { authorizationToken: authToken },
      });
      if (res.status === 404) {
        setAccError(true);
        return;
      }
      const result = await res.text();
      if (result) {
        setAccount(JSON.parse(result));
      }
    } catch (err) {
      setAccError(true);
    }
  }, [authToken]);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    if (authToken) fetchAccount();
  }, [authToken, fetchAccount, refreshKey]);

  return { error, account };
};

export default useGameAccount;
