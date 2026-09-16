import { createEffect, createSignal, onCleanup, type JSX } from 'solid-js'
import { useStopwatch } from '@nl/ui/hooks/useStopwatch'
import { useUserAgent } from '@nl/ui/hooks/useUserAgent'

import { PreloaderBase } from './base'

export function Preloader(props: {
  ready: boolean
  progress: number
  label?: string
}): JSX.Element {
  // Derived value — no signal or sync effect. The previous version kept a
  // `percent` signal mirrored from this accessor plus an interval that could
  // only ever set the signal to its current value.
  const percent = () => Math.round(props.progress <= 1 ? props.progress * 100 : props.progress)
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
    // Signal writes inside effects are synchronous in Solid — no need to
    // defer through setTimeout the way React setState-in-render required.
    if (isMobile && !showWarning() && milliseconds() > 1200) setShowWarning(true)
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
