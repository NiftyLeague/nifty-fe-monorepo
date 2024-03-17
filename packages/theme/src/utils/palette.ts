'use client';

// material-ui
import { createTheme } from '@mui/material/styles';
import type { PaletteMode, ThemeOptions, Theme } from '@mui/material';
import type { ColorProps } from '../types';

// assets
import defaultColor from '../styles/color/_theme_default.module.scss';
import theme1 from '../styles/color/_theme1.module.scss';
import theme2 from '../styles/color/_theme2.module.scss';
import theme3 from '../styles/color/_theme3.module.scss';
import theme4 from '../styles/color/_theme4.module.scss';
import theme5 from '../styles/color/_theme5.module.scss';
import theme6 from '../styles/color/_theme6.module.scss';

// ==============================|| DEFAULT THEME - PALETTE  ||============================== //

const createPalette = (paletteMode: PaletteMode, colors: ColorProps): ThemeOptions['palette'] => ({
  mode: paletteMode,
  common: {
    black: colors.grey900,
    white: colors.grey50,
  },
  primary: {
    light: paletteMode === 'dark' ? colors.darkPrimaryLight : colors.primaryLight,
    main: paletteMode === 'dark' ? colors.darkPrimaryMain : colors.primaryMain,
    dark: paletteMode === 'dark' ? colors.darkPrimaryDark : colors.primaryDark,
    darker: paletteMode === 'dark' ? colors.darkPrimaryDarker : colors.primaryDarker,
  },
  secondary: {
    light: paletteMode === 'dark' ? colors.darkSecondaryLight : colors.secondaryLight,
    main: paletteMode === 'dark' ? colors.darkSecondaryMain : colors.secondaryMain,
    dark: paletteMode === 'dark' ? colors.darkSecondaryDark : colors.secondaryDark,
    darker: paletteMode === 'dark' ? colors.darkSecondaryDarker : colors.secondaryDarker,
  },
  error: {
    light: colors.errorLight,
    main: colors.errorMain,
    dark: colors.errorDark,
  },
  orange: {
    light: colors.orangeLight,
    main: colors.orangeMain,
    dark: colors.orangeDark,
  },
  warning: {
    light: colors.warningLight,
    main: colors.warningMain,
    dark: colors.warningDark,
  },
  success: {
    light: colors.successLight,
    main: colors.successMain,
    dark: colors.successDark,
  },
  grey: {
    50: colors.grey50,
    100: colors.grey100,
    200: colors.grey200,
    300: colors.grey300,
    400: colors.grey400,
    500: colors.grey500,
    600: colors.grey600,
    700: colors.grey700,
    800: colors.grey800,
    900: colors.grey900,
  },
  dark: {
    light: colors.darkLevel1,
    main: colors.darkLevel2,
    dark: colors.darkLevel3,
  },
  text: {
    primary: paletteMode === 'dark' ? colors.darkTextPrimary : colors.textPrimary,
    secondary: paletteMode === 'dark' ? colors.darkTextSecondary : colors.textSecondary,
    hint: colors.grey100,
  },
  divider: paletteMode === 'dark' ? colors.grey700 : colors.grey200,
  border: paletteMode === 'dark' ? colors.grey700 : colors.grey200,
  background: {
    paper: paletteMode === 'dark' ? colors.darkPaper : colors.paper,
    default: paletteMode === 'dark' ? colors.darkBackground : colors.defaultBackground,
  },
});

const customPalette = (paletteMode: PaletteMode, presetColor: string): Theme => {
  let colors: ColorProps;
  switch (presetColor) {
    case 'theme1':
      colors = theme1 as ColorProps;
      break;
    case 'theme2':
      colors = theme2 as ColorProps;
      break;
    case 'theme3':
      colors = theme3 as ColorProps;
      break;
    case 'theme4':
      colors = theme4 as ColorProps;
      break;
    case 'theme5':
      colors = theme5 as ColorProps;
      break;
    case 'theme6':
      colors = theme6 as ColorProps;
      break;
    case 'default':
    default:
      colors = defaultColor as ColorProps;
  }

  return createTheme({ palette: createPalette(paletteMode, colors) });
};

export default customPalette;
