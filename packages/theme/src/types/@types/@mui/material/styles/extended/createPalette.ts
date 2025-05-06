import type {
  Palette as MuiPalette,
  PaletteColor as MuiPaletteColor,
  PaletteColorOptions as MuiPaletteColorOptions,
  PaletteOptions as MuiPaletteOptions,
  SimplePaletteColorOptions as MuiSimplePaletteColorOptions,
  TypeText as MuiTypeText,
} from '@mui/material/styles';

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

export interface Palette extends Omit<MuiPalette, 'text'> {
  orange: PaletteColor;
  dark: PaletteColor;
  darker: PaletteColor;
  border?: string;
  text: TypeText;
}

export interface TypeText extends MuiTypeText {
  hint: string;
}

export interface PaletteOptions extends Omit<MuiPaletteOptions, 'text'> {
  orange?: MuiPaletteColorOptions;
  dark?: MuiPaletteColorOptions;
  border?: string;
  text?: Partial<TypeText>;
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
