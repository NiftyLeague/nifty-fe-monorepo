'use client'

import Link from 'next/link'
import { Button } from '@nl/ui/base/button'

import useVersion from '@/hooks/useVersion'

const InstallerAction = () => {
  const { isWindows, isMacOs, downloadURL, version, message } = useVersion()
  const installerDisabled = isMacOs || !version

  if (installerDisabled) {
    return (
      <Button variant="outline" disabled>
        {!version && isWindows ? 'Fetching installer version...' : message}
      </Button>
    )
  }

  return (
    <Button asChild variant="outline">
      <Link href={downloadURL}>{message}</Link>
    </Button>
  )
}

export default InstallerAction
