'use client'

import { useEffect, useMemo, useState } from 'react'
import { useStopwatch } from '@nl/ui/hooks/useStopwatch'
import { useUserAgent } from '@nl/ui/hooks/useUserAgent'

import { PreloaderBase } from './base'

export function Preloader({
  ready,
  progress,
  label = 'Loading',
}: {
  ready: boolean
  progress: number
  label?: string
}): React.ReactNode {
  const loadingPercentage = Math.round(progress <= 1 ? progress * 100 : progress)
  const [percent, setPercent] = useState<number>(loadingPercentage)
  const { milliseconds, start, stop } = useStopwatch({ interval: 100 })

  const device = useUserAgent()
  const isMobile = useMemo(() => device.isMobile(), [device])
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    if (!ready) start()
    else stop()
    return function cleanup() {
      stop()
    }
  }, [start, stop, ready])

  useEffect(() => {
    if (isMobile && !showWarning && milliseconds > 1200) {
      const id = setTimeout(() => setShowWarning(true), 0)
      return () => clearTimeout(id)
    }
    return undefined
  }, [isMobile, showWarning, milliseconds])

  useEffect(() => {
    if (loadingPercentage !== 90) {
      setPercent(loadingPercentage)
      return undefined
    } else {
      const id = setInterval(() => {
        setPercent((p) => Math.round(p < 80 ? p + 10 : 90))
      }, 100)
      return () => clearInterval(id)
    }
  }, [loadingPercentage, stop])

  return <PreloaderBase ready={ready} percent={percent} showWarning={showWarning} label={label} />
}

export default Preloader
