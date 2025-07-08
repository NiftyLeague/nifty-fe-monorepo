'use client';

import { MY_PROFILE_API_URL } from '@/constants/url';
import type { Profile } from '@/types/account';
import useAuth from './useAuth';
import useFetch from './useFetch';

const usePlayerProfile = (): { error?: Error; profile?: Profile; loadingProfile?: boolean } => {
  const { authToken } = useAuth();
  const headers = { authorizationToken: authToken || '' };
  const { error, data, loading } = useFetch<Profile>(MY_PROFILE_API_URL, { headers, enabled: !!authToken });
  return { error, profile: data, loadingProfile: loading };
};

export default usePlayerProfile;
