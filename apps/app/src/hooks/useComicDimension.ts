import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'

/*
  ~ What it does? ~

  Gets your comic card dimension

  ~ How can I use? ~

  const dimension = useComicDimension();
  dimension.width / dimension.height
*/

export default function useComicDimension() {
  const isSmallScreen = useMediaQuery('(max-width:1024px)')

  return {
    get width() {
      return isSmallScreen() ? 90 : 113
    },
    get height() {
      return isSmallScreen() ? 90 : 113
    },
  }
}
