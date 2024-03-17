'use client';

import { PropsWithChildren } from 'react';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import useCreateTheme from '../hooks/useCreateTheme';
import useThemeConfig from '../hooks/useThemeConfig';
import { ThemeConfigProvider } from './ThemeConfig';
import LocalesProvider from './LocalesProvider';

const ThemeProvider = ({ children }: PropsWithChildren) => {
  const { fontFamily } = useThemeConfig();
  const theme = useCreateTheme();
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <LocalesProvider>
        <div
          className={`${fontFamily.default.variable} ${fontFamily.header.variable} ${fontFamily.subheader.variable} ${fontFamily.special.variable}`}
        >
          {children}
        </div>
      </LocalesProvider>
    </MuiThemeProvider>
  );
};

const ThemeProviderWrapper = ({ children }: PropsWithChildren) => {
  return (
    <AppRouterCacheProvider>
      <ThemeConfigProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </ThemeConfigProvider>
    </AppRouterCacheProvider>
  );
};

export default ThemeProviderWrapper;
