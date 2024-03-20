import useSWR from 'swr';
import type { User, UserInfo } from '@/lib/playfab/types';
import { USER_INFO_INITIAL_STATE } from '@/lib/playfab/constants';
import { fetchJson } from '@/lib/playfab/utils';

export default function useUserInfo(user: User | undefined) {
  // We do a request to /api/playfab/user/info only if the user is logged in
  const {
    data: userInfo,
    error,
    isLoading,
    mutate: mutateUserInfo,
  } = useSWR<UserInfo>(user?.isLoggedIn ? `/api/playfab/user/info` : null, fetchJson);

  return {
    error,
    isLoading,
    mutateUserInfo,
    userInfo: userInfo ?? USER_INFO_INITIAL_STATE,
  };
}
