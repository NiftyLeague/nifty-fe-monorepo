import { useEffect, ReactNode } from 'react';

// material-ui
import { CacheProvider } from '@emotion/react';
import createCache, { StylisPlugin } from '@emotion/cache';

// third-party
import rtlPlugin from 'stylis-plugin-rtl';
import useThemeConfig from '@/theme/hooks/useThemeConfig';

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
