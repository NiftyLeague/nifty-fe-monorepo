'use client';

import { useContext } from 'react';

// Network Provider
import NetworkContext from '@/contexts/NetworkContext';

const useNetworkContext = () => {
  const context = useContext(NetworkContext);

  if (!context) throw new Error('context must be use inside provider');

  return context;
};

export default useNetworkContext;
