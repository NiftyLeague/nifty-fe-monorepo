'use client'

import { useUserAgent } from '@nl/ui/hooks/useUserAgent'

const COMMON_MSG = 'Download Nifty Smashers Beta on mobile or PC!'

enum OS {
  Windows = 'win',
  Android = 'android',
  IOS = 'iOS',
  LINUX = 'linux',
  MAC = 'osx',
}

const useVersion = () => {
  const { isWindows, isAndroid, isIos, isLinux } = useUserAgent()

  if (isAndroid())
    return { message: 'Download Nifty Smashers Beta on Google Play!', os: OS.Android }
  if (isIos()) return { message: 'Download Nifty Smashers Beta on the App Store!', os: OS.IOS }
  if (isWindows()) return { message: COMMON_MSG, os: OS.Windows }
  if (isLinux()) return { message: COMMON_MSG, os: OS.LINUX }
  return { message: COMMON_MSG, os: OS.MAC }
}

export default useVersion
