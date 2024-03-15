import type { ProfileAvatar } from '@/types/account';
import { GET_PROFILE_AVATARS_AND_COST_API } from '@/constants/url';
import useFetch from '@/hooks/useFetch';
import useAuth from '@/hooks/useAuth';

interface ProfileAvatarsRes {
  id: string;
  avatars: ProfileAvatar[];
  price: number;
}
const useProfileAvatarFee = (): {
  errorAvatarsAndFee?: Error;
  avatarsAndFee?: ProfileAvatarsRes;
  loadingAvatarsAndFee?: boolean;
} => {
  const { authToken } = useAuth();
  const headers = { authorizationToken: authToken || '' };
  const { error, data, loading } = useFetch<ProfileAvatarsRes>(GET_PROFILE_AVATARS_AND_COST_API, {
    headers,
    enabled: !!authToken,
  });
  return {
    errorAvatarsAndFee: error,
    avatarsAndFee: data,
    loadingAvatarsAndFee: loading,
  };
};

export default useProfileAvatarFee;
