import '@mui/material/styles';
import { Theme } from './styles/createTheme';

declare module '@mui/material/styles' {
  export function useTheme<T = Theme>(): T;
}
