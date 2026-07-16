import { describe, expect, it } from 'vitest';
import customComponents from './components';
import customMixins from './mixins';
import customPalette from './palette';
import customShadows from './shadows';
import customTypography from './typography';

describe('theme utility factories', () => {
  it.each(['light', 'dark'] as const)('creates a complete %s palette', mode => {
    const theme = customPalette(mode, 'default');

    expect(theme.palette.mode).toBe(mode);
    expect(theme.palette.primary.main).toMatch(/^#/);
    expect(theme.palette.background.default).toBeTruthy();
    expect(theme.palette.divider).toBeTruthy();
  });

  it('builds component overrides for filled and outlined inputs', () => {
    const darkTheme = customPalette('dark', 'default');
    const lightTheme = customPalette('light', 'default');
    const filled = customComponents(darkTheme, 8, true);
    const outlined = customComponents(lightTheme, 8, false);

    expect(filled?.MuiOutlinedInput?.styleOverrides).toBeDefined();
    expect(outlined?.MuiSlider?.styleOverrides).toBeDefined();
    expect(filled?.MuiDivider?.styleOverrides).not.toEqual(outlined?.MuiDivider?.styleOverrides);
  });

  it('creates typography, shadows, and mixins from theme inputs', () => {
    const theme = customPalette('dark', 'default');
    const fontFamily = {
      default: { style: { fontFamily: 'Inter' } },
      header: { style: { fontFamily: 'Header' } },
      subheader: { style: { fontFamily: 'Subheader' } },
      special: { style: { fontFamily: 'Special' } },
    };

    const typography = customTypography(theme, 8, fontFamily as never);
    expect(typeof typography === 'object' ? typography?.fontFamily : undefined).toBe('Inter');
    expect(customShadows(theme, 'dark').primary).toContain('rgba');
    expect(customShadows(theme, 'light').z1).toContain('0 1px 2px');
    expect(customMixins()?.toolbar).toMatchObject({ minHeight: '48px', padding: '16px' });
  });
});
