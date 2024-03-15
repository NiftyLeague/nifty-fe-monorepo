'use client';

import { useEffect, useRef } from 'react';
import { GET_GAMER_PROFILE_API } from '@/constants/url';
import useAuth from '@/hooks/useAuth';
import useFetch from '@/hooks/useFetch';
import type { Profile } from '@/types/account';

const useGamerProfile = (): {
  error?: Error;
  profile?: Profile;
  loadingProfile?: boolean;
  fetchUserProfile?: () => Promise<Profile>;
} => {
  const firstRenderRef = useRef(true);
  useEffect(() => {
    firstRenderRef.current = false;
  }, []);

  const { isLoggedIn, authToken } = useAuth();
  const headers = { authorizationToken: authToken || '' };

  const { error, data, loading } = useFetch<Profile>(GET_GAMER_PROFILE_API, {
    headers,
    enabled: isLoggedIn && !!authToken && !firstRenderRef.current,
  });

  const fetchUserProfile = async () => {
    const res = await fetch(GET_GAMER_PROFILE_API, {
      headers,
    });
    if (res.status === 404) {
      throw Error('Not Found');
    }
    if (res.status === 200) {
      const json = await res.json();
      if (json.statusCode === 400) {
        throw Error(json.body);
      }
      return json as Profile;
    }
    throw Error('Something wrong!');
  };

  return {
    error,
    profile: data,
    loadingProfile: loading,
    fetchUserProfile,
  };
};

export default useGamerProfile;
