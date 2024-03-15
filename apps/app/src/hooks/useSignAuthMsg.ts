'use client';

import { useCallback } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
// reducer - state management
import { useDispatch } from '@/store/hooks';
import { login, logout } from '@/store/slices/account';

import type { AUTH_Token, UUID_Token, Nonce } from '@/types/auth';
import { GOOGLE_ANALYTICS } from '@/constants/google-analytics';
import { sendEvent } from '@/utils/google-analytics';
import { WALLET_VERIFICATION } from '@/constants/url';
import useLocalStorageContext from '@/hooks/useLocalStorageContext';

type Params = { auth?: AUTH_Token; token?: UUID_Token; nonce?: Nonce };

const useSignAuthMsg = (params: Params = {}) => {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const addressToLower = address?.toLowerCase();
  const signAddress = `${addressToLower?.slice(0, 6)}...${addressToLower?.slice(-4)}`;

  const { setAuthToken, uuidToken, setUUIDToken, nonce: storageNonce, setNonce } = useLocalStorageContext();

  const token = params.token || uuidToken;
  const nonce = params.nonce || storageNonce;

  const verifyWallet = async (verification: string) => {
    try {
      const result = await fetch(WALLET_VERIFICATION, {
        method: 'POST',
        body: JSON.stringify({
          token,
          nonce,
          verification,
          address: addressToLower,
        }),
      })
        .then(res => {
          if (res.status === 404) {
            throw Error('Failed to verify signature!');
          }
          return res.text();
        })
        .catch(() => {
          throw Error('Failed to verify signature!');
        });

      if (result?.length) {
        const auth = result.slice(1, -1);
        setAuthToken(auth);
        setUUIDToken(token);
        setNonce(nonce);

        await dispatch(login());
        sendEvent(GOOGLE_ANALYTICS.EVENTS.LOGIN, GOOGLE_ANALYTICS.CATEGORIES.ENGAGEMENT, 'method');
      } else {
        throw Error('Failed to verify signature!');
      }
    } catch (err) {
      console.error('verifyWallet', err);
      dispatch(logout());
    }
  };

  const { signMessageAsync, isError, isSuccess } = useSignMessage({
    mutation: {
      onSuccess(data) {
        verifyWallet(data);
      },
      onError(error) {
        console.error('useSignMessage', error);
        dispatch(logout());
      },
    },
  });

  const signMessage = useCallback(async () => {
    return await signMessageAsync({
      message: `Please sign this message to verify that ${signAddress} belongs to you. ${nonce}`,
    });
  }, [signAddress, nonce, signMessageAsync]);

  return { signMessage, isError, isSuccess };
};

export default useSignAuthMsg;
