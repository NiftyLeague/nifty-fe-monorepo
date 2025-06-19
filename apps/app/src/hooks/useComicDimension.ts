import useMediaQuery from '@nl/ui/hooks/useMediaQuery';

/*
  ~ What it does? ~

  Gets your comic card dimension

  ~ How can I use? ~

  const {width, height} = useComicDimension();
*/

export default function useComicDimension() {
  const isSmallScreen = useMediaQuery('(max-width:1024px)');

  if (isSmallScreen) {
    return { width: 90, height: 90 };
  }

  return { width: 113, height: 113 };
}
