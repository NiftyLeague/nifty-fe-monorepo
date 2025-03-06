import { useTheme as useThemeMui } from '@mui/material/styles';
import { Theme } from '../types';

const useTheme = (): Theme => {
  return useThemeMui<Theme>();
};

export default useTheme;
