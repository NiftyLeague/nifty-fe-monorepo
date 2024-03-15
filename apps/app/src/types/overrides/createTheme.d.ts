import { CustomShadowProps } from '@/types/default-theme';
import '@mui/material/styles';

declare module '@mui/material/styles' {
  export interface Theme {
    customShadows?: CustomShadowProps;
  }

  export interface ThemeOptions {
    customShadows?: CustomShadowProps;
  }

  interface Palette {
    orange: PaletteColorOptions;
    dark: PaletteColorOptions;
    border: string;
  }

  interface PaletteOptions {
    orange?: PaletteColorOptions;
    dark?: PaletteColorOptions;
    border?: string;
  }

  interface PaletteColor {
    darker?: string;
    100?: string;
    200?: string;
    300?: string;
    400?: string;
    500?: string;
    600?: string;
    700?: string;
    800?: string;
    900?: string;
  }

  interface SimplePaletteColorOptions {
    darker?: string;
  }

  interface TypeText {
    hint: string;
  }
}
