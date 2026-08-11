'use client'

import { useState, useEffect } from 'react'
import { useUserAgent } from '@nl/ui/hooks/useUserAgent'
import { DEGEN_BASE_API_URL } from '@/constants/api'
import { TARGET_NETWORK } from '@/constants/networks'

type LauncherPlatform = {
  os: 'unknown' | 'win' | 'osx' | 'linux'
  isWindows: boolean
  isMacOs: boolean
  isLinux: boolean
}

const initialPlatform: LauncherPlatform = {
  os: 'unknown',
  isWindows: false,
  isMacOs: false,
  isLinux: false,
}

const useVersion = () => {
  const [version, setVersion] = useState('')
  const env = TARGET_NETWORK?.chainId === 1 ? 'prod' : 'stage'
  const userAgent = useUserAgent()
  const [platform, setPlatform] = useState<LauncherPlatform>(initialPlatform)

  useEffect(() => {
    const isWindows = userAgent.isWindows()
    const isMacOs = userAgent.isMacOs()
    const isLinux = userAgent.isLinux()
    const os = isWindows ? 'win' : isMacOs ? 'osx' : isLinux ? 'linux' : 'unknown'

    setPlatform({ os, isWindows, isMacOs, isLinux })
  }, [userAgent])

  const { os, isWindows, isMacOs, isLinux } = platform
  const message = isWindows
    ? 'Download for Windows'
    : isMacOs
      ? 'Download for Mac OS not available'
      : isLinux
        ? 'Linux support is not available at this time'
        : 'Your platform is not supported'

  const fileName = `NiftyLauncher-setup-${version.substring(0, version.indexOf('-'))}.exe`
  const downloadURL = `https://d7ct17ettlkln.cloudfront.net/launcher/${env}/${os}/${version}/${fileName}`

  useEffect(() => {
    if (os === 'unknown') return

    let canceled = false

    const fetchVersion = async () => {
      try {
        const response = await fetch(
          `${DEGEN_BASE_API_URL}/launcher/${env}/${os}/version.bin?t=${Date.now()}`
        )
        const nextVersion = response.ok ? await response.text() : ''

        if (!canceled) setVersion(nextVersion)
      } catch {
        if (!canceled) setVersion('')
      }
    }

    fetchVersion()

    return () => {
      canceled = true
    }
  }, [env, os])

  return { downloadURL, version, isWindows, isLinux, isMacOs, message }
}

export default useVersion
