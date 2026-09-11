const ACTIVATION_EVENTS = ['pointerdown', 'keydown', 'touchstart'] as const
const DEFAULT_DELAY = 5000

interface DeferredActivationOptions {
  delay?: number
  onActivate: () => void
}

type ActivationSubscriber = () => void

const subscribers = new Set<ActivationSubscriber>()
let scheduledDelay: number | null = null
let idleId: number | null = null
let timeoutId: number | null = null

const removeActivationListeners = () => {
  for (const eventName of ACTIVATION_EVENTS) {
    window.removeEventListener(eventName, activate)
  }
}

const cancelScheduledActivation = () => {
  if (idleId !== null) {
    window.cancelIdleCallback?.(idleId)
    idleId = null
  }
  if (timeoutId !== null) {
    window.clearTimeout(timeoutId)
    timeoutId = null
  }
  scheduledDelay = null
}

const activate = () => {
  if (subscribers.size === 0) return

  const pendingSubscribers = [...subscribers]
  subscribers.clear()
  removeActivationListeners()
  cancelScheduledActivation()

  for (const subscriber of pendingSubscribers) subscriber()
}

const scheduleActivation = (delay: number) => {
  if (scheduledDelay !== null && scheduledDelay <= delay) return

  cancelScheduledActivation()
  scheduledDelay = delay

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
}

/**
 * Schedules non-essential work after user interaction or an idle timeout.
 * All subscribers share one listener set and timer per page, so mounting
 * multiple deferred features does not multiply global event work.
 */
export function scheduleDeferredActivation({
  delay = DEFAULT_DELAY,
  onActivate,
}: DeferredActivationOptions): () => void {
  subscribers.add(onActivate)
  scheduleActivation(delay)

  return () => {
    subscribers.delete(onActivate)
    if (subscribers.size === 0) {
      removeActivationListeners()
      cancelScheduledActivation()
    }
  }
}
