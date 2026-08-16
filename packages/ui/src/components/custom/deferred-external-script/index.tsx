'use client'

import { useEffect } from 'react'

const ACTIVATION_EVENTS = ['pointerdown', 'keydown', 'touchstart'] as const
const DEFAULT_DELAY = 5000

interface DeferredExternalScriptProps {
  id: string
  src: string
  delay?: number
}

/** Loads a non-essential external script after interaction or an idle delay. */
export default function DeferredExternalScript({
  id,
  src,
  delay = DEFAULT_DELAY,
}: DeferredExternalScriptProps): null {
  useEffect(() => {
    let activated = false
    let idleId: number | null = null
    let timeoutId: number | null = null

    const removeActivationListeners = () => {
      for (const eventName of ACTIVATION_EVENTS) {
        window.removeEventListener(eventName, activate)
      }
    }

    const cancelIdleActivation = () => {
      if (idleId !== null) {
        window.cancelIdleCallback?.(idleId)
        idleId = null
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
        timeoutId = null
      }
    }

    const activate = () => {
      if (activated) return
      activated = true
      removeActivationListeners()
      cancelIdleActivation()

      if (document.getElementById(id)) return

      const script = document.createElement('script')
      script.id = id
      script.src = src
      script.async = true
      document.head.appendChild(script)
    }

    for (const eventName of ACTIVATION_EVENTS) {
      window.addEventListener(eventName, activate, { once: true, passive: true })
    }

    if (window.requestIdleCallback) {
      timeoutId = window.setTimeout(() => {
        timeoutId = null
        idleId = window.requestIdleCallback(activate, { timeout: 1000 })
      }, delay)
    } else {
      timeoutId = window.setTimeout(activate, delay)
    }

    return () => {
      removeActivationListeners()
      cancelIdleActivation()
    }
  }, [delay, id, src])

  return null
}
