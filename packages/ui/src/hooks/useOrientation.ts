'use client'

import { useEffect, useState } from 'react'

const getOrientation = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return 'landscape'
  return window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape'
}

export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(getOrientation)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const media = window.matchMedia('(orientation: portrait)')
    const handler = () => setOrientation(media.matches ? 'portrait' : 'landscape')
    handler()
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  return {
    orientation,
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
  }
}

export default useOrientation
