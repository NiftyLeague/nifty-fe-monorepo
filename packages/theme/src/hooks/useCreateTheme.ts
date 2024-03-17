'use client';

import { useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import type { ThemeOptions, Theme } from '@mui/material/styles';

// project imports
import { customComponents, customMixins, customPalette, customShadows, customTypography } from '../utils';
import useThemeConfig from './useThemeConfig';
import type { CustomShadowProps } from '../types';

const useCreateTheme = () => {
  const config = useThemeConfig();

  const colorTheme = useMemo<Theme>(
    () => customPalette(config.paletteMode, config.presetColor),
    [config.paletteMode, config.presetColor],
  );

  const typography = useMemo<ThemeOptions['typography']>(
    () => customTypography(colorTheme, config.borderRadius, config.fontFamily),
    [colorTheme, config.borderRadius],
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

  const themeOptions: ThemeOptions = useMemo(
    () => ({
      breakpoints: config.breakpoints,
      components,
      customShadows: shadows,
      direction: config.rtlLayout ? 'rtl' : 'ltr',
      mixins,
      palette: colorTheme.palette,
      typography,
    }),
    [config.breakpoints, colorTheme, components, shadows, mixins, config.rtlLayout, typography],
  );

  const theme: Theme = createTheme(themeOptions);

  return theme;
};

export default useCreateTheme;
