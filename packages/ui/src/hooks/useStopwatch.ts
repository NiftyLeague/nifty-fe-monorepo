import { createEffect, createSignal, onCleanup, type Accessor } from 'solid-js'

export const STATUS = { RUNNING: 'running', PAUSED: 'paused', STOPPED: 'stopped' }

type Timer = { ts: number; ms?: number }

interface HookParams {
  interval?: number
  onStop?: (Timer: Timer) => void
  onStart?: (Timer: Timer) => void
  onPause?: (Timer: Timer) => void
  onRestart?: (Timer: Timer) => void
}

type ReturnType = {
  milliseconds: Accessor<number>
  status: Accessor<string>
  start: () => void
  pause: () => void
  stop: () => void
  restart: () => void
}

export const useStopwatch = ({
  interval = 10,
  onStop,
  onStart,
  onPause,
  onRestart,
}: HookParams): ReturnType => {
  let stopwatchId: number | null = null
  const [status, setStatus] = createSignal(STATUS.STOPPED)
  const [milliseconds, setMilliseconds] = createSignal(0)
  let ms = 0

  const clearTimer = () => {
    if (stopwatchId !== null) {
      clearInterval(stopwatchId)
      stopwatchId = null
    }
  }

  const restart = () => {
    const ts = Date.now()
    const msCache = ms
    ms = 0
    setMilliseconds(0)
    setStatus(STATUS.RUNNING)
    if (onRestart) onRestart({ ts, ms: msCache })
  }

  const start = () => {
    const ts = Date.now()
    setStatus(STATUS.RUNNING)
    if (onStart) onStart({ ts })
  }

  const pause = () => {
    const ts = Date.now()
    setStatus(STATUS.PAUSED)
    if (onPause) onPause({ ts, ms })
  }

  const stop = () => {
    setStatus(STATUS.STOPPED)
    const ts = Date.now()
    const msCache = ms
    ms = 0
    setMilliseconds(0)
    if (onStop) onStop({ ts, ms: msCache })
  }

  createEffect(() => {
    if (status() === STATUS.RUNNING) {
      clearTimer()
      stopwatchId = setInterval(() => {
        ms += interval
        setMilliseconds(ms)
      }, interval) as unknown as number
    } else {
      clearTimer()
    }

    onCleanup(clearTimer)
  })

  return { milliseconds, status, start, pause, stop, restart }
}

export default useStopwatch
