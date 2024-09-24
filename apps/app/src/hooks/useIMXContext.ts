'use client';

import { useContext } from 'react';

// IMX Provider
import IMXContext, { Context } from '@/contexts/IMXContext';

const useIMXContext = () => {
  const context = useContext(IMXContext);

  if (!context) throw new Error('context must be use inside provider');

  return context;
};

export type { Context };

export default useIMXContext;
