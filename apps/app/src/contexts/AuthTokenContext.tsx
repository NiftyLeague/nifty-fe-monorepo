'use client';

import { createContext, useCallback, useRef, useEffect, type PropsWithChildren } from 'react';
import { useAppKit, useAppKitEvents } from '@reown/appkit/react';
import { useAccount } from 'wagmi';

import type { AuthTokenContextType } from '@/types/auth';
import { useSelector } from '@/store/hooks';
import useCheckAuth from '@/hooks/useCheckAuth';
import useLocalStorageContext from '@/hooks/useLocalStorageContext';
import useSignAuthMsg from '@/hooks/useSignAuthMsg';
import { DEBUG } from '@/constants/index';

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const AuthTokenContext = createContext<AuthTokenContextType | null>(null);

export const AuthTokenProvider = ({ children }: PropsWithChildren) => {
  const modal = useAppKit();
  const { isConnected } = useAccount();
  const { checkAddress } = useCheckAuth();
  const { signMessage } = useSignAuthMsg();
  const { isLoggedIn } = useSelector(state => state.account);
  const { authToken } = useLocalStorageContext();
  const events = useAppKitEvents();
  const msgSent = useRef(false);

  const signMsg = useCallback(async () => {
    const initialized = await checkAddress();
    if (!initialized) await signMessage();
    msgSent.current = true;
  }, [checkAddress, signMessage]);

  const handleConnectWallet = useCallback(async () => {
    if (!isConnected) {
      modal.open();
      return;
    }
    await signMsg();
  }, [isConnected, signMsg, modal]);

  useEffect(() => {
    if (events?.data?.event === 'CONNECT_SUCCESS') {
      if (DEBUG) console.log('CONNECT_SUCCESS');
      if (!isLoggedIn && msgSent.current === false) {
        msgSent.current = true;
        handleConnectWallet();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, isLoggedIn]);

  return (
    <AuthTokenContext.Provider value={{ authToken, handleConnectWallet, isConnected, isLoggedIn }}>
      {children}
    </AuthTokenContext.Provider>
  );
};

export default AuthTokenContext;
