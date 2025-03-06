import type {
  TypographyStyle,
  TypographyStyleOptions,
  TypographyUtils,
  Variant as MuiVariant,
} from '@mui/material/styles/createTypography';

import type { Palette } from './createPalette';

declare module '@mui/material/styles/createTypography' {
  export interface FontStyle
    extends Required<{
      textTransform: React.CSSProperties['textTransform'];
      fontSize: string | number; // added string
    }> {}

  export interface FontStyleOptions extends Partial<FontStyle> {
    fontSize?: string | number; // added string
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

  export interface TypographyOptions extends Partial<Record<Variant, TypographyStyleOptions> & FontStyleOptions> {
    customInput?: TypographyStyleOptions;
    mainContent?: TypographyStyleOptions;
    menuCaption?: TypographyStyleOptions;
    subMenuCaption?: TypographyStyleOptions;
    commonAvatar?: TypographyStyleOptions;
    smallAvatar?: TypographyStyleOptions;
    mediumAvatar?: TypographyStyleOptions;
    largeAvatar?: TypographyStyleOptions;
  }

  export interface Typography extends Record<Variant, TypographyStyle>, FontStyle, TypographyUtils {
    customInput: TypographyStyle;
    mainContent: TypographyStyle;
    caption: TypographyStyle;
    menuCaption: TypographyStyle;
    subMenuCaption: TypographyStyle;
    commonAvatar: TypographyStyle;
    smallAvatar: TypographyStyle;
    mediumAvatar: TypographyStyle;
    largeAvatar: TypographyStyle;
  }

  export default function createTypography(
    palette: Palette,
    typography: TypographyOptions | ((palette: Palette) => TypographyOptions),
  ): Typography;
}
