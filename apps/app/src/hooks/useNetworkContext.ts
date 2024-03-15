'use client';

import { useContext } from 'react';

// balance provider
import NetworkContext from '@/contexts/NetworkContext';

// ==============================|| AUTH HOOKS ||============================== //

const useNetworkContext = () => {
  const context = useContext(NetworkContext);

  if (!context) throw new Error('context must be use inside provider');

  return context;
};

export default useNetworkContext;
