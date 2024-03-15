import type { ThemeConfigProps } from '@/types/default-theme';

// theme constants
export const gridSpacing = 3;
export const sectionSpacing = 2;
export const cardSpacing = 2;
export const appHeaderHeight = 92;
export const drawerWidth = 260;
export const appDrawerWidth = 320;

export const defaultConfig: ThemeConfigProps = {
  // fontFamily: `'Roboto', sans-serif`,
  borderRadius: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1020,
      lg: 1360,
      xl: 1750,
    },
  },
  container: false,
  locale: 'en', // 'en' - English, 'fr' - French, 'ro' - Romanian, 'zh' - Chinese
  outlinedFilled: true,
  paletteMode: 'dark', // light, dark
  presetColor: 'default', // default, theme1, theme2, theme3, theme4, theme5, theme6
  rtlLayout: false,
};
