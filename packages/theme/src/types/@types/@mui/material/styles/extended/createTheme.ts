import type {
  ColorSystem as MuiColorSystem,
  CssVarsPalette as MuiCssVarsPalette,
  CssVarsTheme as MuiCssVarsTheme,
  CssVarsThemeOptions as MuiCssVarsThemeOptions,
  SupportedColorScheme as MuiSupportedColorScheme,
  ThemeVars as MuiThemeVars,
} from '@mui/material/styles/createThemeWithVars';
import type { Components as MuiComponents } from '@mui/material/styles/components';
import type { Theme as MuiTheme, ThemeOptions as MuiThemeOptions } from '@mui/material/styles/createTheme';

import { CustomShadowProps, Palette, PaletteOptions } from './createPalette';
import { Typography, TypographyOptions } from './createTypography';

export interface Theme extends Omit<MuiTheme, 'palette' | 'typography'> {
  customShadows?: CustomShadowProps;
  palette: Palette;
  typography: Typography;
}

export interface ThemeOptions extends Omit<MuiThemeOptions, 'components' | 'typography' | 'palette'> {
  components?: MuiComponents<Omit<Theme, 'components'>>;
  customShadows?: CustomShadowProps;
  palette?: PaletteOptions;
  typography?: TypographyOptions | ((palette: Palette) => TypographyOptions);
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
