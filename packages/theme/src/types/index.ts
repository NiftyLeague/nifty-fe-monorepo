import type { BreakpointsOptions, Color, PaletteMode } from '@mui/material';
import type { NextFontWithVariable } from '@next/font';

export type CustomFonts = {
  defaultFontFamily: string;
  headerFontFamily: string;
  subheaderFontFamily: string;
  specialFontFamily: string;
};

export type FontFamily = {
  default: NextFontWithVariable;
  header: NextFontWithVariable;
  subheader: NextFontWithVariable;
  special: NextFontWithVariable;
};

export type ThemeConfigProps = {
  fontFamily: FontFamily;
  borderRadius: number;
  breakpoints: BreakpointsOptions;
  container: boolean;
  locale: string;
  outlinedFilled: boolean;
  paletteMode: PaletteMode;
  presetColor: string;
  rtlLayout: boolean;
};

export interface ThemeCustomizationProps extends ThemeConfigProps {
  onChangeFontFamily: (fontFamily: FontFamily) => void;
  onChangeBorderRadius: (event: Event, newValue: number | number[]) => void;
  onChangeBreakpoints: (breakpoints: BreakpointsOptions) => void;
  onChangeContainer: () => void;
  onChangeLocale: (locale: string) => void;
  onChangeMenuType: (paletteMode: PaletteMode) => void;
  onChangeOutlinedField: (outlinedFilled: boolean) => void;
  onChangePresetColor: (presetColor: string) => void;
  onChangeRTL: (rtlLayout: boolean) => void;
}

export type ColorProps = {
  // primary
  primaryLight: string;
  primaryMain: string;
  primaryDark: string;
  primaryDarker: string;

  // secondary
  secondaryLight: string;
  secondaryMain: string;
  secondaryDark: string;
  secondaryDarker: string;

  // success
  successLight: string;
  successMain: string;
  successDark: string;

  // error
  errorLight: string;
  errorMain: string;
  errorDark: string;

  // orange
  orangeLight: string;
  orangeMain: string;
  orangeDark: string;

  // warning
  warningLight: string;
  warningMain: string;
  warningDark: string;

  // grey
  grey50: string;
  grey100: string;
  grey200: string;
  grey300: string;
  grey400: string;
  grey500: string;
  grey600: string;
  grey700: string;
  grey800: string;
  grey900: string;

  // paper & background
  paper: string;
  defaultBackground: string;

  // text variants
  textPrimary: string;
  textSecondary: string;

  // DARK THEME VARIANTS //

  // primary dark
  darkPrimaryLight: string;
  darkPrimaryMain: string;
  darkPrimaryDark: string;
  darkPrimaryDarker: string;

  // secondary dark
  darkSecondaryLight: string;
  darkSecondaryMain: string;
  darkSecondaryDark: string;
  darkSecondaryDarker: string;

  // paper & background
  darkPaper: string;
  darkBackground: string;

  // text variants
  darkTextPrimary: string;
  darkTextSecondary: string;

  // Dark - light, main, dark
  darkLevel1: string;
  darkLevel2: string;
  darkLevel3: string;
};

export type CustomShadowProps = {
  z1: string;
  z8: string;
  z12: string;
  z16: string;
  z20: string;
  z24: string;
  primary: string;
  secondary: string;
  orange: string;
  success: string;
  warning: string;
  error: string;
};

export interface CustomTypography extends ColorProps, CustomShadowProps {
  customInput?: {
    marginTop: number;
    marginBottom: number;
    '& > label': {
      top: string;
      left: number;
      color?: Color | (Color | undefined)[] | Color[];
      '&[data-shrink="false"]': {
        top: string;
      };
    };
    '& > div > input': {
      padding: string;
    };
    '& legend': {
      display: string;
    };
    '& fieldset': {
      top: number;
    };
  };
  mainContent?: {
    backgroundColor?: string;
    width: string;
    minHeight: string;
    flexGrow: number;
    marginTop: string;
    borderRadius: string;
  };
  menuCaption?: {
    fontSize: string;
    fontWeight: number;
    color?: Color | (Color | undefined)[] | Color[];
    padding: string;
    textTransform: 'uppercase' | 'lowercase' | 'capitalize' | 'inherit';
    marginTop: string;
  };
  subMenuCaption?: {
    fontSize: string;
    fontWeight: number;
    color: Color | (Color | undefined)[] | Color[];
    textTransform: 'uppercase' | 'lowercase' | 'capitalize' | 'inherit';
  };
  commonAvatar?: {
    cursor: string;
    borderRadius: string;
  };
  smallAvatar?: {
    width: string;
    height: string;
    fontSize: string;
  };
  mediumAvatar?: {
    width: string;
    height: string;
    fontSize: string;
  };
  largeAvatar?: {
    width: string;
    height: string;
    fontSize: string;
  };
  heading?: string;
  textDark?: string;
  colors?: CustomTypography;
  backgroundDefault?: string;
  menuSelected?: string;
  menuSelectedBack?: string;
  divider?: string;
  customization?: ThemeCustomizationProps;
}
