'use client';

import { createContext, useCallback, type PropsWithChildren, type Dispatch, type SetStateAction } from 'react';
import type { AgreementAccepted, AUTH_Token, Nonce, USER_ID, UUID_Token } from '@/types/auth';
import { createUUID, createNonce } from '@/utils/auth';
import useLocalStorage from '@/hooks/useLocalStorage';

// ==============================|| Local Storage CONTEXT & PROVIDER ||============================== //

type LocalStorageContextType = {
  // AUTH
  authToken?: AUTH_Token;
  setAuthToken: Dispatch<SetStateAction<AUTH_Token>>;
  // UUID
  uuidToken?: UUID_Token;
  setUUIDToken: Dispatch<SetStateAction<UUID_Token>>;
  // NONCE
  nonce?: Nonce;
  setNonce: Dispatch<SetStateAction<Nonce>>;
  // USER ID
  userId?: string;
  setUserId: Dispatch<SetStateAction<string | undefined>>;
  // FAV DEGENS
  favDegens?: string[];
  setFavDegens: Dispatch<SetStateAction<string[] | undefined>>;
  // FAV DEGENS
  agreementAccepted?: AgreementAccepted;
  setAgreementAccepted: Dispatch<SetStateAction<AgreementAccepted>>;
  // UTILITY
  setAllAuth: (a: AUTH_Token, u: UUID_Token, n: Nonce, i?: USER_ID) => void;
  clearAllAuth: () => void;
};
const LocalStorageContext = createContext<LocalStorageContextType | null>(null);

const initialState: {
  authToken: AUTH_Token;
  uuidToken: UUID_Token;
  nonce: Nonce;
  userId: USER_ID;
  favDegens: string[];
  agreementAccepted: AgreementAccepted;
} = {
  authToken: undefined,
  uuidToken: createUUID(),
  nonce: createNonce(),
  userId: undefined,
  favDegens: [],
  agreementAccepted: 'FALSE',
};

export const LocalStorageProvider = ({ children }: PropsWithChildren) => {
  const [authToken, setAuthToken, clearAuthToken] = useLocalStorage<AUTH_Token>(
    'authentication-token',
    initialState.authToken,
  );
  const [uuidToken, setUUIDToken] = useLocalStorage<UUID_Token>('uuid-token', initialState.uuidToken);
  const [nonce, setNonce] = useLocalStorage<Nonce>('nonce', initialState.nonce);
  const [userId, setUserId, clearUserId] = useLocalStorage<USER_ID>('user-id', initialState.userId);
  const [favDegens, setFavDegens] = useLocalStorage<string[]>('FAV_DEGENS', initialState.favDegens);
  const [agreementAccepted, setAgreementAccepted] = useLocalStorage<AgreementAccepted>(
    'aggreement-accepted',
    initialState.agreementAccepted,
  );

  const setAllAuth = useCallback(
    (a: AUTH_Token, u: UUID_Token, n: Nonce, i?: USER_ID) => {
      setAuthToken(a);
      setUUIDToken(u);
      setNonce(n);
      if (i) setUserId(i);
    },
    [setAuthToken, setNonce, setUserId, setUUIDToken],
  );

  const clearAllAuth = useCallback(() => {
    clearAuthToken();
    clearUserId();
    setUUIDToken(createUUID());
    setNonce(createNonce());
  }, [clearAuthToken, clearUserId, setNonce, setUUIDToken]);

  return (
    <LocalStorageContext.Provider
      value={{
        authToken,
        setAuthToken,
        uuidToken,
        setUUIDToken,
        nonce,
        setNonce,
        userId,
        setUserId,
        favDegens,
        setFavDegens,
        agreementAccepted,
        setAgreementAccepted,
        setAllAuth,
        clearAllAuth,
      }}
    >
      {children}
    </LocalStorageContext.Provider>
  );
};

export default LocalStorageContext;
