'use client';

import { useContext } from 'react';

// localStorage provider
import LocalStorageContext from '@/contexts/LocalStorageContext';

// ==============================|| AUTH HOOKS ||============================== //

const useLocalStorageContext = () => {
  const context = useContext(LocalStorageContext);

  if (!context) throw new Error('context must be use inside provider');

  return context;
};

export default useLocalStorageContext;
