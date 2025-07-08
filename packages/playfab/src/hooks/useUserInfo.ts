'use client';

import useSWR from 'swr';
import type { User, UserInfo } from '../types';
import { USER_INFO_INITIAL_STATE } from '../constants';
import fetchJson from '../utils/fetchJson';

export default function useUserInfo(user: User | undefined) {
  // We do a request to /api/playfab/user/info only if the user is logged in
  const {
    data: userInfo,
    error,
    isLoading,
    mutate: mutateUserInfo,
  } = useSWR<UserInfo>(user?.isLoggedIn ? `/api/playfab/user/info` : null, fetchJson);

  return { error, isLoading, mutateUserInfo, userInfo: userInfo ?? USER_INFO_INITIAL_STATE };
}
