import '@mui/material/styles/createTheme';
import { CustomShadowProps } from '../../../../index';
import { Palette, PaletteOptions } from './createPalette';
import { Typography, TypographyOptions } from './createTypography';

declare module '@mui/material/styles/createTheme' {
  export interface Theme extends BaseTheme {
    customShadows?: CustomShadowProps;
    palette: Palette;
    typography: Typography;
  }

  export interface ThemeOptions extends Omit<SystemThemeOptions, 'zIndex'> {
    customShadows?: CustomShadowProps;
    palette?: PaletteOptions;
    typography?: TypographyOptions;
  }

  export function useTheme<T = Theme>(): T;
}
