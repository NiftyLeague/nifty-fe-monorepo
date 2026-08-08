'use client'

import { useMemo } from 'react'

type DeviceType = 'mobile' | 'tablet' | 'desktop'

const getDeviceType = (userAgent: string): DeviceType => {
  const ua = userAgent
  if (/iPad/i.test(ua)) return 'tablet'
  if (/Android/i.test(ua) && !/Mobile/i.test(ua)) return 'tablet'
  if (
    /Android/i.test(ua) ||
    /iPhone|iPod/i.test(ua) ||
    /Windows Phone|IEMobile/i.test(ua) ||
    /BlackBerry|BB10/i.test(ua) ||
    /Opera Mini/i.test(ua) ||
    /Kindle|Silk/i.test(ua)
  ) {
    return 'mobile'
  }
  return 'desktop'
}

const getBrowserName = (userAgent: string) => {
  const ua = userAgent
  if (/Opera|OPR\//i.test(ua)) return 'Opera'
  if (/Edg\//i.test(ua)) return 'Microsoft Edge'
  if (/Chrome/i.test(ua) && !/CriOS/i.test(ua)) return 'Chrome'
  if (/Firefox|FxiOS/i.test(ua)) return 'Firefox'
  if (/CriOS/i.test(ua)) return 'Chrome'
  if (/Safari/i.test(ua)) return 'Safari'
  return 'Unknown Browser'
}

const getUserAgent = (userAgent: string) => {
  const type = getDeviceType(userAgent)
  const isAndroid = () => Boolean(userAgent.match(/Android/i))
  const isIos = () => Boolean(userAgent.match(/iPhone|iPad|iPod/i))
  const isOpera = () => Boolean(userAgent.match(/Opera|OPR\//i))
  const isWindows = () => Boolean(userAgent.match(/Windows/i))
  const isMacOs = () => Boolean(userAgent.match(/Macintosh|Mac OS X/i) && !isIos())
  const isLinux = () => Boolean(userAgent.match(/Linux/i) && !isAndroid())
  const isSSR = () => Boolean(userAgent.match(/SSR/i))
  const isMobile = () => type !== 'desktop'
  const isMobileOnly = () => type === 'mobile'
  const isTablet = () => type === 'tablet'
  const isDesktop = () => type === 'desktop' && !isSSR()

  return {
    isMobile,
    isMobileOnly,
    isTablet,
    isDesktop,
    isAndroid,
    isIos,
    isOpera,
    isWindows,
    isMacOs,
    isLinux,
    isSSR,
    browserName: getBrowserName(userAgent),
  }
}

export const useUserAgent = () => {
  const userAgent = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent
  return useMemo(() => getUserAgent(userAgent), [userAgent])
}

export default useUserAgent
