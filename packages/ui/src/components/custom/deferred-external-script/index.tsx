import { onCleanup, onMount } from 'solid-js'

import { scheduleDeferredActivation } from '@nl/ui/lib/deferred-activation'

interface DeferredExternalScriptProps {
  id: string
  src: string
  delay?: number
}

/** Loads a non-essential external script after interaction or an idle delay. */
export default function DeferredExternalScript(props: DeferredExternalScriptProps): null {
  onMount(() => {
    const cleanup = scheduleDeferredActivation({
      delay: props.delay,
      onActivate: () => {
        if (document.getElementById(props.id)) return

        const script = document.createElement('script')
        script.id = props.id
        script.src = props.src
        script.async = true
        document.head.appendChild(script)
      },
    })

    onCleanup(cleanup)
  })

  return null
}
