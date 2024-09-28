'use client';

import { useContext } from 'react';
import TokensBalanceContext from '@/contexts/TokensBalanceContext';

const useTokensBalances = () => {
  const context = useContext(TokensBalanceContext);

  if (!context) throw new Error('context must be use inside provider');

  return context;
};

export default useTokensBalances;
