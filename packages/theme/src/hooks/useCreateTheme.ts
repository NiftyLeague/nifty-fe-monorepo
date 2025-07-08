'use client';

import { useMemo } from 'react';
import {
  createTheme as muiCreateTheme,
  type Theme as MuiTheme,
  type ThemeOptions as MuiThemeOptions,
} from '@mui/material/styles';

// project imports
import type { CustomShadowProps, Theme, ThemeOptions } from '../types';
import { customComponents, customMixins, customPalette, customShadows, customTypography } from '../utils';
import useThemeConfig from './useThemeConfig';

const useCreateTheme = (): Theme => {
  const config = useThemeConfig();

  if (typeof window !== 'undefined') {
    const paletteMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    config.paletteMode = paletteMode;
  }

  const colorTheme = useMemo<Theme>(
    () => customPalette(config.paletteMode, config.presetColor),
    [config.paletteMode, config.presetColor],
  );

  const typography = useMemo<ThemeOptions['typography']>(
    () => customTypography(colorTheme, config.borderRadius, config.fontFamily),
    [colorTheme, config.borderRadius, config.fontFamily],
  );

  const shadows = useMemo<CustomShadowProps>(
    () => customShadows(colorTheme, config.paletteMode),
    [colorTheme, config.paletteMode],
  );

  const components = useMemo<ThemeOptions['components']>(
    () => customComponents(colorTheme, config.borderRadius, config.outlinedFilled),
    [colorTheme, config.borderRadius, config.outlinedFilled],
  );

  const mixins = useMemo<ThemeOptions['mixins']>(() => customMixins(), []);

  const baseThemeOptions: MuiThemeOptions = useMemo(
    () => ({
      breakpoints: config.breakpoints,
      direction: config.rtlLayout ? 'rtl' : 'ltr',
      mixins,
      palette: colorTheme.palette,
      components,
      cssVarPrefix: 'mui',
    }),
    [config.breakpoints, colorTheme, components, mixins, config.rtlLayout],
  );

  // Create base theme first
  const baseTheme = muiCreateTheme(baseThemeOptions);

  // Then extend it with our custom properties
  return {
    cssVariables: true,
    ...baseTheme,
    customShadows: shadows,
    typography: { ...baseTheme.typography, ...typography },
  } as Theme;
};

export default useCreateTheme;
