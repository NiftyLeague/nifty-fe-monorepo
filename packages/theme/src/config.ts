import type { ThemeConfigProps } from './types';
import { imbPlexSans, lilitaOne, nexaRustSansBlack, pressStart } from '@nl/ui/fonts';
import { borderRadius, breakpoints, container, outlinedFilled } from './constants/index';

export const defaultConfig: ThemeConfigProps = {
  fontFamily: { default: imbPlexSans, header: nexaRustSansBlack, subheader: pressStart, special: lilitaOne },
  borderRadius,
  breakpoints,
  container,
  locale: 'en', // 'en' - English, 'fr' - French, 'ro' - Romanian, 'zh' - Chinese
  outlinedFilled,
  paletteMode: 'dark', // light, dark
  presetColor: 'default', // default, theme1, theme2, theme3, theme4, theme5, theme6
  rtlLayout: false,
};

export default defaultConfig;
