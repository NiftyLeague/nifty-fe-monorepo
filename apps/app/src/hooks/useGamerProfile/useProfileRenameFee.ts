'use client';

import { PROFILE_RENAME_API } from '@/constants/url';
import useAuth from '@/hooks/useAuth';
import useFetch from '@/hooks/useFetch';

const useProfileRenameFee = (): { errorFee?: Error; fee?: number; loadingFee?: boolean } => {
  const { authToken } = useAuth();
  const headers = { authorizationToken: authToken || '' };
  const { error, data, loading } = useFetch<{ id: string; price: number }>(PROFILE_RENAME_API, {
    headers,
    enabled: !!authToken,
  });
  return { errorFee: error, fee: data?.price, loadingFee: loading };
};

export default useProfileRenameFee;
