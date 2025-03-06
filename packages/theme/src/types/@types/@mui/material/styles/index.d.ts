import { CreateMUIStyled } from '@mui/system';
import { Theme, ThemeOptions } from './createTheme';

export * from './createPalette';
export * from './createTheme';
export * from './createTypography';

declare module '@mui/material/styles' {
  export function useTheme<T = Theme>(): T;

  export function createTheme(options?: ThemeOptions, ...args: object[]): Theme;

  declare const styled: CreateMUIStyled<Theme>;

  export { styled };
}

declare module '@mui/material/styles/styled' {
  declare const styled: CreateMUIStyled<Theme>;
  export default styled;
}

declare module '@mui/material/styles/useTheme' {
  export default function useTheme<T = Theme>(): T;
}
