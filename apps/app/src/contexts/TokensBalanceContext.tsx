'use client';

import { createContext, useEffect, useRef } from 'react';
import type { PropsWithChildren } from 'react';

import useArcadeBalance from '@/hooks/balances/useArcadeBalance';
import useAuth from '@/hooks/useAuth';
import useClaimableNFTL from '@/hooks/balances/useClaimableNFTL';
import useNFTLBalance from '@/hooks/balances/useNFTLBalance';
import useNFTsBalances from '@/hooks/balances/useNFTsBalances';

interface TokensBalanceContext {
  arcadeBalance: number;
  loadingArcadeBal: boolean;
  loadingNFTLAccrued: boolean;
  loadingNFTLBal: boolean;
  refetchArcadeBal: () => void;
  refreshClaimableNFTL: () => void;
  refreshNFTLBalance: () => void;
  totalAccrued: number;
  userNFTLBalance: number;
}

const CONTEXT_INITIAL_STATE: TokensBalanceContext = {
  arcadeBalance: 0,
  loadingArcadeBal: false,
  loadingNFTLAccrued: false,
  loadingNFTLBal: false,
  refetchArcadeBal: () => {},
  refreshClaimableNFTL: () => {},
  refreshNFTLBalance: () => {},
  totalAccrued: 0,
  userNFTLBalance: 0,
};

const TokensBalanceContext = createContext<TokensBalanceContext>(CONTEXT_INITIAL_STATE);

export const TokensBalanceProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const { degenTokenIndices, loadingDegens } = useNFTsBalances();
  const firstRenderRef = useRef(true);
  const { isLoggedIn } = useAuth();

  // Load user Ethereum NFTL balances
  const { totalAccrued, loading: claimLoading, refetch: refreshClaimableNFTL } = useClaimableNFTL(degenTokenIndices);
  const { balance: userNFTLBalance, loading: loadingNFTLBal, refetch: refreshNFTLBalance } = useNFTLBalance();

  // Load user off-chain Arcade Token balance
  const { balance: arcadeBalance, loading: arcadeLoading, refetch: refetchArcadeBal } = useArcadeBalance();

  // Refetch on login state change, avoiding initial render
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    if (!isLoggedIn) return;
    refreshClaimableNFTL();
    refreshNFTLBalance();
    refetchArcadeBal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  return (
    <TokensBalanceContext.Provider
      value={{
        arcadeBalance,
        loadingArcadeBal: arcadeLoading,
        loadingNFTLAccrued: loadingDegens || claimLoading,
        loadingNFTLBal,
        refetchArcadeBal,
        refreshClaimableNFTL,
        refreshNFTLBalance,
        totalAccrued,
        userNFTLBalance,
      }}
    >
      {children}
    </TokensBalanceContext.Provider>
  );
};

export default TokensBalanceContext;
