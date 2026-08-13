'use client'

import { useMediaQuery } from './useMediaQuery'

export const useOrientation = () => {
  const isPortrait = useMediaQuery('(orientation: portrait)')
  const orientation = isPortrait ? 'portrait' : 'landscape'

  return {
    orientation,
    isPortrait,
    isLandscape: orientation === 'landscape',
  }
}

export default useOrientation
