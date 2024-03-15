'use client';

import { createContext, type PropsWithChildren } from 'react';
import type { BreakpointsOptions, PaletteMode } from '@mui/material';

import type { ThemeConfigProps, ThemeCustomizationProps } from '@/types/default-theme';
import useLocalStorage from '@/hooks/useLocalStorage';
import { defaultConfig } from './constants';

// initial state
const initialState: ThemeCustomizationProps = {
  ...defaultConfig,
  // onChangeFontFamily: () => {},
  onChangeBorderRadius: () => {},
  onChangeBreakpoints: () => {},
  onChangeContainer: () => {},
  onChangeLocale: () => {},
  onChangeMenuType: () => {},
  onChangeOutlinedField: () => {},
  onChangePresetColor: () => {},
  onChangeRTL: () => {},
};

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const ThemeConfigContext = createContext(initialState);

function ThemeConfigProvider({ children }: PropsWithChildren) {
  const [config, setConfig] = useLocalStorage<ThemeConfigProps>('berry-config', {
    // fontFamily: initialState.fontFamily,
    borderRadius: initialState.borderRadius,
    breakpoints: initialState.breakpoints,
    container: initialState.container,
    locale: initialState.locale,
    outlinedFilled: initialState.outlinedFilled,
    paletteMode: initialState.paletteMode,
    presetColor: initialState.presetColor,
    rtlLayout: initialState.rtlLayout,
  });

  const onChangeMenuType = (paletteMode: PaletteMode) => {
    setConfig({ ...(config as ThemeConfigProps), paletteMode });
  };

  const onChangePresetColor = (presetColor: string) => {
    setConfig({ ...(config as ThemeConfigProps), presetColor });
  };

  const onChangeLocale = (locale: string) => {
    setConfig({ ...(config as ThemeConfigProps), locale });
  };

  const onChangeRTL = (rtlLayout: boolean) => {
    setConfig({ ...(config as ThemeConfigProps), rtlLayout });
  };

  const onChangeContainer = () => {
    setConfig({ ...(config as ThemeConfigProps), container: !config?.container });
  };

  // const onChangeFontFamily = (fontFamily: string) => {
  //   setConfig({ ...config as ConfigProps, fontFamily });
  // };

  const onChangeBorderRadius = (event: Event, newValue: number | number[]) => {
    setConfig({ ...(config as ThemeConfigProps), borderRadius: newValue as number });
  };

  const onChangeOutlinedField = (outlinedFilled: boolean) => {
    setConfig({ ...(config as ThemeConfigProps), outlinedFilled });
  };

  const onChangeBreakpoints = (breakpoints: BreakpointsOptions) => {
    setConfig({ ...(config as ThemeConfigProps), breakpoints });
  };

  return (
    <ThemeConfigContext.Provider
      value={{
        ...(config as ThemeConfigProps),
        // onChangeFontFamily,
        onChangeBorderRadius,
        onChangeBreakpoints,
        onChangeContainer,
        onChangeLocale,
        onChangeMenuType,
        onChangeOutlinedField,
        onChangePresetColor,
        onChangeRTL,
      }}
    >
      {children}
    </ThemeConfigContext.Provider>
  );
}

export { ThemeConfigProvider, ThemeConfigContext };
