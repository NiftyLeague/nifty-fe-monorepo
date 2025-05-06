import type { CreateMUIStyled } from '@mui/system';
import type { CSSProperties } from 'react';
import type {
  PaletteColorOptions,
  TypographyStyle as MuiTypographyStyle,
  TypographyVariant,
  Theme as MuiTheme,
  ThemeOptions as MuiThemeOptions,
} from '@mui/material/styles';

declare module '@mui/material/styles' {
  // * ===============================
  // * Palette
  // * ===============================
  export interface SimplePaletteColorOptions extends PaletteColorOptions {
    darker?: string;
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

  export interface Palette {
    orange: PaletteColor;
    dark: PaletteColor;
    darker: PaletteColor;
    border?: string;
  }

  export interface TypeText {
    hint: string;
  }

  export interface PaletteOptions {
    orange?: PaletteColorOptions;
    dark?: PaletteColorOptions;
    border?: string;
  }

  export default function createPalette(palette: PaletteOptions): Palette;

  // * ===============================
  // * Typography
  // * ===============================
  // Override base TypographyStyle to allow string fontSize and CSS properties
  export interface TypographyStyle extends Omit<MuiTypographyStyle, 'fontSize' | 'fontWeight'>, CSSProperties {
    fontSize?: string | number;
    color?: string;
    fontFamily?: string;
    fontWeight?: string | number;
    fontStyle?: CSSProperties['fontStyle'];
    lineHeight?: string | number;
    letterSpacing?: string | number;
    textTransform?: CSSProperties['textTransform'];
    [key: `& ${string}`]: any;
  }

  export interface FontStyle extends Omit<TypographyStyle, 'fontSize'> {
    fontSize: string | number;
    textTransform: CSSProperties['textTransform'];
  }

  export interface FontStyleOptions extends Partial<FontStyle> {
    allVariants?: CSSProperties;
  }

  // Custom variants
  export type CustomVariant =
    | 'customInput'
    | 'mainContent'
    | 'menuCaption'
    | 'subMenuCaption'
    | 'commonAvatar'
    | 'smallAvatar'
    | 'mediumAvatar'
    | 'largeAvatar';

  export type Variant = TypographyVariant | CustomVariant;

  export interface TypographyVariantsOptions extends Partial<Record<Variant, TypographyStyle> & FontStyleOptions> {
    fontFamily?: string;
    fontSize?: number;
    fontWeightBold?: number;
    fontWeightLight?: number;
    fontWeightMedium?: number;
    fontWeightRegular?: number;
    customInput?: TypographyStyle;
    mainContent?: TypographyStyle;
    menuCaption?: TypographyStyle;
    subMenuCaption?: TypographyStyle;
    commonAvatar?: TypographyStyle;
    smallAvatar?: TypographyStyle;
    mediumAvatar?: TypographyStyle;
    largeAvatar?: TypographyStyle;
  }

  export interface TypographyVariants extends Record<Variant, TypographyStyle>, FontStyle {
    fontWeightBold?: number;
    fontWeightLight?: number;
    fontWeightMedium?: number;
    fontWeightRegular?: number;
    customInput: TypographyStyle;
    mainContent: TypographyStyle;
    menuCaption: TypographyStyle;
    subMenuCaption: TypographyStyle;
    commonAvatar: TypographyStyle;
    smallAvatar: TypographyStyle;
    mediumAvatar: TypographyStyle;
    largeAvatar: TypographyStyle;
  }

  export default function createTypography(
    palette: Palette,
    typography: TypographyVariantsOptions | ((palette: Palette) => TypographyVariantsOptions),
  ): TypographyVariants;

  // * ===============================
  // * Theme
  // * ===============================
  export interface Theme extends Omit<MuiTheme, 'typography'> {
    customShadows?: CustomShadowProps;
    typography: TypographyVariants;
  }

  export interface ThemeOptions extends Omit<MuiThemeOptions, 'typography'> {
    customShadows?: CustomShadowProps;
    typography?: TypographyVariantsOptions | ((palette: Palette) => TypographyVariantsOptions);
  }
  export function createTheme(options?: ThemeOptions, ...args: object[]): Theme;
  export function useTheme<T = Theme>(): T;

  // * ===============================
  // * Styled
  // * ===============================
  export const styled: CreateMUIStyled<Theme>;
}
