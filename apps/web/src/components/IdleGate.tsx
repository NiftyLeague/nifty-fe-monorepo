import { Show, createSignal, onCleanup, onMount, type JSX, type ParentComponent } from 'solid-js'
import { scheduleDeferredActivation } from '@nl/ui/lib/deferred-activation'

const IdleGate: ParentComponent<{ fallback?: JSX.Element }> = (props) => {
  const [idle, setIdle] = createSignal(false)

  onMount(() => {
    let release: (() => void) | undefined
    let cap: ReturnType<typeof setTimeout> | undefined

    const schedule = () => {
      if (release) return
      cap = undefined
      release = scheduleDeferredActivation({
        delay: 0,
        idleTimeout: 2500,
        onActivate: () => setIdle(true),
      })
    }

    if (document.readyState === 'complete') schedule()
    else {
      window.addEventListener('load', schedule, { once: true })
      // Never hold the embed past a hard cap, even if load stalls.
      cap = setTimeout(schedule, 6000)
    }

    onCleanup(() => {
      window.removeEventListener('load', schedule)
      if (cap) clearTimeout(cap)
      release?.()
    })
  })

  return (
    <Show when={idle()} fallback={props.fallback}>
      {props.children}
    </Show>
  )
}

export default IdleGate
