'use client';

import { useEffect, ReactNode } from 'react';
import rtlPlugin from 'stylis-plugin-rtl';

// material-ui
import { CacheProvider } from '@emotion/react';
import createCache, { StylisPlugin } from '@emotion/cache';

import useThemeConfig from '../hooks/useThemeConfig';

// ==============================|| RTL LAYOUT ||============================== //

interface RTLLayoutProps {
  children: ReactNode;
}

const RTLLayout = ({ children }: RTLLayoutProps) => {
  const { rtlLayout } = useThemeConfig();

  useEffect(() => {
    document.dir = rtlLayout ? 'rtl' : 'ltr';
  }, [rtlLayout]);

  const cacheRtl = createCache({
    key: rtlLayout ? 'rtl' : 'css',
    prepend: true,
    stylisPlugins: rtlLayout ? [rtlPlugin as StylisPlugin] : [],
  });

  return <CacheProvider value={cacheRtl}>{children}</CacheProvider>;
};

export default RTLLayout;
