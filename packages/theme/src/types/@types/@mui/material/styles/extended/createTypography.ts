import type { TypographyStyle as MuiTypographyStyle, TypographyVariant } from '@mui/material/styles';
import type { CSSProperties } from 'react';

type FontWeight = 'inherit' | 'initial' | 'revert' | 'unset' | 'normal' | 'bold' | 'lighter' | 'bolder' | number;

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
