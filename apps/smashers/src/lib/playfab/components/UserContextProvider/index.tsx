import React, { createContext, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

import { fetchJson, FetchError } from '@/lib/playfab/utils/fetchJson';
import { USER_CONTEXT_INITIAL_STATE } from '@/lib/playfab/constants';
import { useUserSession, useUserInfo } from '@/lib/playfab/hooks';
import type { User, UserContextType } from '@/lib/playfab/types';

export const UserContext = createContext<UserContextType>(USER_CONTEXT_INITIAL_STATE);

type Props = { [propName: string]: any };

export const UserContextProvider = (props: Props) => {
  const { query } = useRouter();
  const gameToken = query['game-token'] as string | undefined;
  const { user, mutateUser } = useUserSession();
  const { userInfo, mutateUserInfo } = useUserInfo(user);
  const isLoggedIn = Boolean(user?.isLoggedIn);
  const persistLogin = Boolean(user?.persistLogin);
  const customId = user?.CustomId;

  const handleAnonLogin = useCallback(
    async (CustomId: string) => {
      // Login player with stored CustomID
      try {
        const res = await fetchJson<User>('/api/playfab/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ CustomId }),
        });
        mutateUser(res);
      } catch (error) {
        // Cleanup & force logout so we can verify Custom ID
        const status = (error as FetchError).response.status;
        switch (status) {
          case 400: // AccountDeleted
          case 404: // AccountNotFound
            mutateUser(await fetchJson('/api/playfab/logout', { method: 'POST' }));
            break;
          default:
            break;
        }
      }
    },
    [mutateUser],
  );

  useEffect(() => {
    if (gameToken) {
      void handleAnonLogin(gameToken);
    } else if (!isLoggedIn && customId && persistLogin) {
      void handleAnonLogin(customId);
    }
  }, [gameToken, customId, handleAnonLogin, isLoggedIn, persistLogin]);

  const refetchPlayer = useCallback(async () => await mutateUserInfo(), [mutateUserInfo]);

  const value = useMemo(
    () => ({
      account: userInfo?.AccountInfo,
      currencies: userInfo?.UserVirtualCurrency,
      customId: user?.CustomId,
      inventory: userInfo?.UserInventory,
      isLoggedIn: isLoggedIn,
      playFabId: user?.PlayFabId,
      profile: userInfo?.PlayerProfile,
      publisherData: userInfo?.PublisherData,
      refetchPlayer,
      stats: userInfo?.PlayerStatistics,
    }),
    [isLoggedIn, refetchPlayer, user, userInfo],
  );

  return <UserContext.Provider value={value} {...props} />;
};
