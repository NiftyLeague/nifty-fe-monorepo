import type {
  FontStyle as MuiFontStyle,
  TypographyStyle as MuiTypographyStyle,
  TypographyStyleOptions as MuiTypographyStyleOptions,
  TypographyUtils as MuiTypographyUtils,
  Variant as MuiVariant,
} from '@mui/material/styles/createTypography';

export interface FontStyle
  extends Omit<MuiFontStyle, 'fontSize'>,
    Required<{ fontSize: string | number; textTransform: React.CSSProperties['textTransform'] }> {
  textTransform: React.CSSProperties['textTransform'];
  fontSize: string | number; // added string
}

export interface FontStyleOptions extends Partial<FontStyle> {
  allVariants?: React.CSSProperties;
}

export type Variant =
  | MuiVariant
  | 'customInput'
  | 'mainContent'
  | 'menuCaption'
  | 'subMenuCaption'
  | 'commonAvatar'
  | 'smallAvatar'
  | 'mediumAvatar'
  | 'largeAvatar';

export interface TypographyOptions extends Partial<Record<Variant, MuiTypographyStyleOptions> & FontStyleOptions> {
  customInput?: MuiTypographyStyleOptions;
  mainContent?: MuiTypographyStyleOptions;
  menuCaption?: MuiTypographyStyleOptions;
  subMenuCaption?: MuiTypographyStyleOptions;
  commonAvatar?: MuiTypographyStyleOptions;
  smallAvatar?: MuiTypographyStyleOptions;
  mediumAvatar?: MuiTypographyStyleOptions;
  largeAvatar?: MuiTypographyStyleOptions;
}

export interface Typography extends Record<Variant, MuiTypographyStyle>, FontStyle, MuiTypographyUtils {
  customInput: MuiTypographyStyle;
  mainContent: MuiTypographyStyle;
  caption: MuiTypographyStyle;
  menuCaption: MuiTypographyStyle;
  subMenuCaption: MuiTypographyStyle;
  commonAvatar: MuiTypographyStyle;
  smallAvatar: MuiTypographyStyle;
  mediumAvatar: MuiTypographyStyle;
  largeAvatar: MuiTypographyStyle;
}
