'use client';

import { PropsWithChildren } from 'react';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import { ThemeConfigProvider } from './ThemeConfig';
import LocalesProvider from './LocalesProvider';
import useTheme from './hooks/useTheme';

const ThemeProvider = ({ children }: PropsWithChildren) => {
  const theme = useTheme();
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <LocalesProvider>{children}</LocalesProvider>
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
