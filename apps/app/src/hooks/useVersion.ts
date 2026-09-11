'use client'

import { useQuery } from '@tanstack/react-query'
import { useUserAgent } from '@nl/ui/hooks/useUserAgent'
import { DEGEN_BASE_API_URL } from '@/constants/api'
import { fetchApiQuery, queryKeys } from '@/query/app-query'
import { NETWORK } from '@/runtime/env'

const useVersion = () => {
  const env = NETWORK === 'mainnet' ? 'prod' : 'stage'
  const userAgent = useUserAgent()
  const isWindows = userAgent.isWindows()
  const isMacOs = userAgent.isMacOs()
  const isLinux = userAgent.isLinux()
  const os = isWindows ? 'win' : isMacOs ? 'osx' : isLinux ? 'linux' : 'unknown'
  const { data: version = '' } = useQuery({
    queryKey: queryKeys.launcherVersion(env, os),
    queryFn: ({ signal }) =>
      fetchApiQuery<string>(`${DEGEN_BASE_API_URL}/launcher/${env}/${os}/version.bin`, {
        signal,
        textOnly: true,
      }),
    enabled: os === 'win',
  })
  const message = isWindows
    ? 'Download for Windows'
    : isMacOs
      ? 'Download for Mac OS not available'
      : isLinux
        ? 'Linux support is not available at this time'
        : 'Your platform is not supported'

  const fileName = `NiftyLauncher-setup-${version.substring(0, version.indexOf('-'))}.exe`
  const downloadURL = `https://d7ct17ettlkln.cloudfront.net/launcher/${env}/${os}/${version}/${fileName}`

  return { downloadURL, version, isWindows, isLinux, isMacOs, message }
}

export default useVersion
