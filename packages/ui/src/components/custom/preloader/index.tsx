import { createEffect, createSignal, onCleanup, type JSX } from 'solid-js'
import { useStopwatch } from '@nl/ui/hooks/useStopwatch'
import { useUserAgent } from '@nl/ui/hooks/useUserAgent'

import { PreloaderBase } from './base'

export function Preloader(props: {
  ready: boolean
  progress: number
  label?: string
}): JSX.Element {
  const loadingPercentage = () =>
    Math.round(props.progress <= 1 ? props.progress * 100 : props.progress)
  const [percent, setPercent] = createSignal<number>(loadingPercentage())
  const { milliseconds, start, stop } = useStopwatch({ interval: 100 })

  const device = useUserAgent()
  const isMobile = device.isMobile()
  const [showWarning, setShowWarning] = createSignal(false)

  createEffect(() => {
    if (!props.ready) start()
    else stop()
    onCleanup(stop)
  })

  createEffect(() => {
    if (isMobile && !showWarning() && milliseconds() > 1200) {
      const id = setTimeout(() => setShowWarning(true), 0)
      onCleanup(() => clearTimeout(id))
    }
  })

  createEffect(() => {
    if (loadingPercentage() !== 90) {
      setPercent(loadingPercentage())
      return
    }
    const id = setInterval(() => {
      setPercent((p) => Math.round(p < 80 ? p + 10 : 90))
    }, 100)
    onCleanup(() => clearInterval(id))
  })

  return (
    <PreloaderBase
      ready={props.ready}
      percent={percent()}
      showWarning={showWarning()}
      label={props.label}
    />
  )
}

export default Preloader
