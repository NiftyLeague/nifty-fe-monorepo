import type {
  ColorPartial as MuiColorPartial,
  Palette as MuiPalette,
  PaletteColor as MuiPaletteColor,
  PaletteOptions as MuiPaletteOptions,
  SimplePaletteColorOptions as MuiSimplePaletteColorOptions,
  TypeText as MuiTypeText,
} from '@mui/material/styles/createPalette';

export interface SimplePaletteColorOptions extends MuiSimplePaletteColorOptions {
  darker?: string;
}

export interface PaletteColor extends MuiPaletteColor {
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

export type PaletteColorOptions = SimplePaletteColorOptions | MuiColorPartial;

export interface Palette extends MuiPalette {
  orange: PaletteColor;
  dark: PaletteColor;
  darker: PaletteColor;
  border?: string;
}

export interface TypeText extends MuiTypeText {
  hint: string;
}

export interface PaletteOptions extends MuiPaletteOptions {
  primary?: PaletteColorOptions;
  secondary?: PaletteColorOptions;
  error?: PaletteColorOptions;
  orange?: PaletteColorOptions;
  warning?: PaletteColorOptions;
  success?: PaletteColorOptions;
  dark?: PaletteColorOptions;
  text?: Partial<TypeText>;
  border?: string;
}

export interface CustomShadowProps {
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
}
