'use client';

import { useContext } from 'react';
import { ThemeConfigContext } from '../context/ThemeConfig';

// ==============================|| THEME CONFIG - HOOK  ||============================== //

const useThemeConfig = () => {
  const context = useContext(ThemeConfigContext);

  if (!context) throw new Error('context must be use inside provider');

  return context;
};

export default useThemeConfig;
