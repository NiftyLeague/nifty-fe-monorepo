'use client';

import { useCallback, useEffect, useState } from 'react';
import { WITHDRAW_NFTL_LIST } from '@/constants/url';
import type { WithdrawalHistory } from '@/types/account';
import useAuth from './useAuth';

const useWithdrawalHistory = (state?: WithdrawalHistory['state']) => {
  const [loading, setLoading] = useState(true);
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalHistory[]>([]);
  const { authToken } = useAuth();

  const fetchWithdrawalHistory = useCallback(async () => {
    if (!authToken) {
      return;
    }
    const res = await fetch(`${WITHDRAW_NFTL_LIST}${state ? `?state=${state}` : ''}`, {
      headers: { authorizationToken: authToken },
    });
    if (res && res.status === 200) setWithdrawalHistory(await res.json());
    setLoading(false);
  }, [authToken, state]);

  useEffect(() => {
    if (!authToken) {
      return;
    }

    fetchWithdrawalHistory();
  }, [authToken, fetchWithdrawalHistory]);

  return {
    loading,
    withdrawalHistory: withdrawalHistory.sort((a, b) => b.created_at - a.created_at),
  };
};

export default useWithdrawalHistory;
