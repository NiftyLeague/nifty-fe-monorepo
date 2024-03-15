'use client';

import { useContext } from 'react';
import { ThemeConfigContext } from '@/theme/ThemeConfig';

// ==============================|| THEME CONFIG - HOOK  ||============================== //

const useThemeConfig = () => useContext(ThemeConfigContext);

export default useThemeConfig;
