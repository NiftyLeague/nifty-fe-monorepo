'use client'

import { useEffect } from 'react'

import { scheduleDeferredActivation } from '@nl/ui/lib/deferred-activation'

interface DeferredExternalScriptProps {
  id: string
  src: string
  delay?: number
}

/** Loads a non-essential external script after interaction or an idle delay. */
export default function DeferredExternalScript({
  id,
  src,
  delay,
}: DeferredExternalScriptProps): null {
  useEffect(() => {
    const cleanup = scheduleDeferredActivation({
      delay,
      onActivate: () => {
        if (document.getElementById(id)) return

        const script = document.createElement('script')
        script.id = id
        script.src = src
        script.async = true
        document.head.appendChild(script)
      },
    })

    return cleanup
  }, [delay, id, src])

  return null
}
