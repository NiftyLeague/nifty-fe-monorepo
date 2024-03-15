import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

/*
  ~ What it does? ~

  Gets your comic card dimension

  ~ How can I use? ~

  const {width, height} = useComicDimension();
*/

export default function useComicDimension() {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  if (isTablet) {
    return { width: 90, height: 90 };
  }

  return { width: 113, height: 113 };
}
