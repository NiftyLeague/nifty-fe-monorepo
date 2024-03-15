'use client';

import { useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import type { ThemeOptions, Theme } from '@mui/material/styles';

// project imports
import { customComponents, customMixins, customPalette, customShadows, customTypography } from '@/theme/theme-options';
import useThemeConfig from '@/theme/hooks/useThemeConfig';
import type { CustomShadowProps } from '@/types/default-theme';

const useTheme = () => {
  const {
    // fontFamily,
    borderRadius,
    breakpoints,
    outlinedFilled,
    paletteMode,
    presetColor,
    rtlLayout,
  } = useThemeConfig();

  const colorTheme = useMemo<Theme>(() => customPalette(paletteMode, presetColor), [paletteMode, presetColor]);

  const typography = useMemo<ThemeOptions['typography']>(
    () => customTypography(colorTheme, borderRadius), //, fontFamily),
    [colorTheme, borderRadius],
  );
  const shadows = useMemo<CustomShadowProps>(() => customShadows(colorTheme, paletteMode), [colorTheme, paletteMode]);
  const components = useMemo<ThemeOptions['components']>(
    () => customComponents(colorTheme, borderRadius, outlinedFilled),
    [colorTheme, borderRadius, outlinedFilled],
  );
  const mixins = useMemo<ThemeOptions['mixins']>(() => customMixins(), []);

  const themeOptions: ThemeOptions = useMemo(
    () => ({
      breakpoints,
      components,
      customShadows: shadows,
      direction: rtlLayout ? 'rtl' : 'ltr',
      mixins,
      palette: colorTheme.palette,
      typography,
    }),
    [breakpoints, colorTheme, components, shadows, mixins, rtlLayout, typography],
  );

  const theme: Theme = createTheme(themeOptions);

  return theme;
};

export default useTheme;
