import type {
  ColorSystem as MuiColorSystem,
  Components as MuiComponents,
  CssVarsPalette as MuiCssVarsPalette,
  CssVarsTheme as MuiCssVarsTheme,
  CssVarsThemeOptions as MuiCssVarsThemeOptions,
  SupportedColorScheme as MuiSupportedColorScheme,
  Theme as MuiTheme,
  ThemeOptions as MuiThemeOptions,
  ThemeVars as MuiThemeVars,
} from '@mui/material/styles';

import { CustomShadowProps, Palette } from './createPalette';
import { TypographyVariants, TypographyVariantsOptions } from './createTypography';

export interface Theme extends Omit<MuiTheme, 'typography'> {
  customShadows?: CustomShadowProps;
  typography: TypographyVariants;
}

export interface ThemeOptions extends Omit<MuiThemeOptions, 'typography'> {
  customShadows?: CustomShadowProps;
  typography?: TypographyVariantsOptions | ((palette: Palette) => TypographyVariantsOptions);
}

export interface ColorSystem extends MuiColorSystem {
  palette: Palette & MuiCssVarsPalette;
}

export interface ThemeVars extends MuiThemeVars {
  palette: Omit<
    ColorSystem['palette'],
    'colorScheme' | 'mode' | 'contrastThreshold' | 'tonalOffset' | 'getContrastText' | 'augmentColor'
  >;
}

export interface CssVarsTheme extends Omit<MuiCssVarsTheme, 'typography'> {
  colorSchemes: Partial<Record<MuiSupportedColorScheme, ColorSystem>>;
  generateThemeVars: () => ThemeVars;
  typography: Theme['typography'];
  vars: ThemeVars;
}

export interface CssVarsThemeOptions
  extends Omit<MuiCssVarsThemeOptions, 'components' | 'typography'>,
    Omit<ThemeOptions, 'palette' | 'components' | 'customShadows'> {
  components?: MuiComponents<Omit<Theme, 'components'> & CssVarsTheme>;
  customShadows?: CustomShadowProps;
}
