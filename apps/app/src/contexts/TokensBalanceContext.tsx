'use client';

import { createContext, useEffect, useMemo, useRef } from 'react';
import type { PropsWithChildren } from 'react';

import useArcadeBalance from '@/hooks/balances/useArcadeBalance';
import useAuth from '@/hooks/useAuth';
import useClaimableNFTL from '@/hooks/balances/useClaimableNFTL';
import useNFTLBalance from '@/hooks/balances/useNFTLBalance';
import useNFTsBalances from '@/hooks/balances/useNFTsBalances';

interface TokensBalances {
  AT: number; // Arcade Token
  NFTL: { eth: number; imx: number }; // NFTL cross-chain
}

interface TokensBalanceContext {
  loadingArcadeBal: boolean;
  loadingNFTLAccrued: boolean;
  loadingNFTLBal: boolean;
  refetchArcadeBal: () => void;
  refreshClaimableNFTL: () => void;
  refreshNFTLBalance: () => void;
  tokensBalances: TokensBalances;
  totalAccruedNFTL: number;
}

const CONTEXT_INITIAL_STATE: TokensBalanceContext = {
  loadingArcadeBal: false,
  loadingNFTLAccrued: false,
  loadingNFTLBal: false,
  refetchArcadeBal: () => {},
  refreshClaimableNFTL: () => {},
  refreshNFTLBalance: () => {},
  tokensBalances: { AT: 0, NFTL: { eth: 0, imx: 0 } },
  totalAccruedNFTL: 0,
};

const TokensBalanceContext = createContext<TokensBalanceContext>(CONTEXT_INITIAL_STATE);

export const TokensBalanceProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const { degenTokenIndices: degens, loadingDegens } = useNFTsBalances();
  const firstRenderRef = useRef(true);
  const { isLoggedIn } = useAuth();

  // Load user DEGEN's NFTL claimable balance
  const { balance: totalAccruedNFTL, loading: loadingClaim, refetch: refreshClaimableNFTL } = useClaimableNFTL(degens);
  // Load user Ethereum & Immutable zkEVM NFTL balances
  const { balances: nftlBalances, loading: loadingNFTLBal, refetch: refreshNFTLBalance } = useNFTLBalance();
  // Load user off-chain Arcade Token (AT) balance
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

  const tokensBalances = useMemo(() => ({ AT: arcadeBalance, NFTL: nftlBalances }), [arcadeBalance, nftlBalances]);

  return (
    <TokensBalanceContext.Provider
      value={{
        loadingArcadeBal: arcadeLoading,
        loadingNFTLAccrued: loadingDegens || loadingClaim,
        loadingNFTLBal,
        refetchArcadeBal,
        refreshClaimableNFTL,
        refreshNFTLBalance,
        tokensBalances,
        totalAccruedNFTL,
      }}
    >
      {children}
    </TokensBalanceContext.Provider>
  );
};

export default TokensBalanceContext;
