import '@mui/material/styles/createPalette';

declare module '@mui/material/styles/createPalette' {
  export interface SimplePaletteColorOptions {
    darker?: string;
  }

  export type PaletteColorOptions = SimplePaletteColorOptions | ColorPartial;

  export interface Palette {
    orange: PaletteColorOptions;
    dark: PaletteColorOptions;
    border: string;
  }

  export interface PaletteOptions {
    orange?: PaletteColorOptions;
    dark?: PaletteColorOptions;
    border?: string;
  }

  export interface PaletteColor {
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

  export interface TypeText {
    hint: string;
  }
}
