'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';

// reducer - state management
import { useDispatch, useSelector } from '@/store/hooks';
import { login, logout } from '@/store/slices/account';

import { ADDRESS_VERIFICATION } from '@/constants/url';
import useLocalStorageContext from '@/hooks/useLocalStorageContext';

const useCheckAuth = () => {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const { authToken, clearAllAuth } = useLocalStorageContext();
  const { isLoggedIn } = useSelector(state => state.account);
  const cache = useRef({ address, authToken, verified: false });
  const firstRenderRef = useRef(true);

  const checkAddress = useCallback(async () => {
    if (authToken && address) {
      if (cache.current.verified && authToken === cache.current.authToken && address == cache.current.address) {
        return true;
      }

      const result = await fetch(ADDRESS_VERIFICATION, {
        headers: { authorizationToken: authToken },
      })
        .then(res => {
          if (res.status === 404) return null;
          return res.text();
        })
        .catch(() => null);
      if (result && result.slice(1, -1) === address.toLowerCase()) {
        cache.current = { address, authToken, verified: true };
        return true;
      }
      cache.current.verified = false;
      return false;
    }
    cache.current.verified = false;
    return false;
  }, [address, authToken]);

  const verify = useCallback(async () => {
    const addressVerified = await checkAddress();
    if (addressVerified) {
      dispatch(login());
    } else {
      dispatch(logout());
      clearAllAuth();
    }
  }, [checkAddress, clearAllAuth, dispatch]);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    if (isLoggedIn && (!authToken || !address)) dispatch(logout());
    else if (authToken && address) void verify();
  }, [address, authToken, dispatch, isLoggedIn, verify]);

  return { checkAddress, verify };
};

export default useCheckAuth;
