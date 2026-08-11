'use client'

import { useState, useEffect } from 'react'
import { useUserAgent } from '@nl/ui/hooks/useUserAgent'
import { DEGEN_BASE_API_URL } from '@/constants/api'
import { TARGET_NETWORK } from '@/constants/networks'

const useVersion = () => {
  const [version, setVersion] = useState('')
  const env = TARGET_NETWORK.chainId === 1 ? 'prod' : 'stage'
  const { isWindows, isMacOs } = useUserAgent()
  const isLinux = window?.navigator?.userAgent?.indexOf('Linux') >= 0
  const os = isWindows() ? 'win' : isMacOs() ? 'osx' : isLinux ? 'linux' : 'unknown'
  const message = isWindows()
    ? 'Download for Windows'
    : isMacOs()
      ? 'Download for Mac OS not available'
      : isLinux
        ? 'Linux support is not available at this time'
        : 'Your platform is not supported'

  const fileName = `NiftyLauncher-setup-${version.substring(0, version.indexOf('-'))}.exe`
  const downloadURL = `https://d7ct17ettlkln.cloudfront.net/launcher/${env}/${os}/${version}/${fileName}`

  useEffect(() => {
    const fetchVersion = async () => {
      const v: string = await fetch(
        `${DEGEN_BASE_API_URL}/launcher/${env}/${os}/version.bin?t=${Date.now()}`
      )
        .then(async (res) => {
          if (res.status >= 400) {
            console.error(await res.text())
            return ''
          }
          return res.text()
        })
        .catch((e) => {
          console.error(e)
          return ''
        })
      setVersion(v)
    }
    fetchVersion()
  }, [env, os])

  return { downloadURL, version, isWindows: isWindows(), isLinux, isMacOs: isMacOs(), message }
}

export default useVersion
