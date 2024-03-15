import { PROFILE_FAV_DEGENS_API } from '@/constants/url';
import useAuth from '@/hooks/useAuth';
import useFetch from '@/hooks/useFetch';

const useProfileFavDegens = (): {
  error?: Error;
  favs?: string;
  loadingFavs?: boolean;
} => {
  const { authToken } = useAuth();
  const headers = { authorizationToken: authToken || '' };
  const { error, data, loading } = useFetch<{
    favorites: string;
  }>(PROFILE_FAV_DEGENS_API, {
    headers,
    enabled: !!authToken,
  });
  return { error, favs: data?.favorites, loadingFavs: loading };
};

export default useProfileFavDegens;
