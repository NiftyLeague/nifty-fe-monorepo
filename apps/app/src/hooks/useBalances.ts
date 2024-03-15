'use client';

import { useContext } from 'react';

// balance provider
import BalanceContext from '@/contexts/BalanceContext';

// ==============================|| AUTH HOOKS ||============================== //

const useBalances = () => {
  const context = useContext(BalanceContext);

  if (!context) throw new Error('context must be use inside provider');

  return context;
};

export default useBalances;
