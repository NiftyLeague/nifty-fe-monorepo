import { useMediaQuery } from '@mui/material';
import { useTheme } from '@nl/theme';

/*
  ~ What it does? ~

  Gets your comic card dimension

  ~ How can I use? ~

  const {width, height} = useComicDimension();
*/

export default function useComicDimension() {
  const theme = useTheme();
  const isScreenLG = useMediaQuery(theme.breakpoints.up('lg'));

  if (!isScreenLG) {
    return { width: 90, height: 90 };
  }

  return { width: 113, height: 113 };
}
