import { CustomShadowProps, Palette, PaletteOptions } from './createPalette';
import { Typography, TypographyOptions } from './createTypography';

declare module '@mui/material/styles/createTheme' {
  interface Theme {
    customShadows?: CustomShadowProps;
    palette: Palette;
    typography: Typography;
  }

  export interface ThemeOptions {
    customShadows?: CustomShadowProps;
    palette?: PaletteOptions;
    typography?: TypographyOptions | ((palette: Palette) => TypographyOptions);
  }
  export function createTheme(options?: ThemeOptions, ...args: object[]): Theme;
}

// declare module '@mui/material/styles/createThemeNoVars' {
//   export type { Theme, ThemeOptions } from './createTheme';
//   export default function createThemeNoVars(options?: ThemeOptions, ...args: object[]): Theme;
// }

// declare module '@mui/material/styles/createThemeWithVars' {
//   export type { ColorSystem, CssVarsTheme, CssVarsThemeOptions, Theme, ThemeOptions, ThemeVars } from './createTheme';
//   export default function createThemeWithVars(
//     options?: CssVarsThemeOptions,
//     ...args: object[]
//   ): Omit<Theme, 'applyStyles'> & CssVarsTheme;
// }
