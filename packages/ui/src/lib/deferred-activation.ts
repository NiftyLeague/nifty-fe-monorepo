const ACTIVATION_EVENTS = ['pointerdown', 'keydown', 'touchstart'] as const
const DEFAULT_DELAY = 5000
const DEFAULT_IDLE_TIMEOUT = 1000

interface DeferredActivationOptions {
  /**
   * How long to wait before asking the browser for idle time. Interaction still
   * activates immediately.
   */
  delay?: number
  /**
   * Ceiling passed to `requestIdleCallback`. A caller that wants the work to run
   * at the first idle period rather than after a fixed wait passes `delay: 0`
   * and its own ceiling.
   */
  idleTimeout?: number
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

const scheduleActivation = (delay: number, idleTimeout: number) => {
  if (scheduledDelay !== null && scheduledDelay <= delay) return

  cancelScheduledActivation()
  scheduledDelay = delay

  for (const eventName of ACTIVATION_EVENTS) {
    window.addEventListener(eventName, activate, { once: true, passive: true })
  }

  if (window.requestIdleCallback) {
    timeoutId = window.setTimeout(() => {
      timeoutId = null
      idleId = window.requestIdleCallback(activate, { timeout: idleTimeout })
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
  idleTimeout = DEFAULT_IDLE_TIMEOUT,
  onActivate,
}: DeferredActivationOptions): () => void {
  subscribers.add(onActivate)
  scheduleActivation(delay, idleTimeout)

  return () => {
    subscribers.delete(onActivate)
    if (subscribers.size === 0) {
      removeActivationListeners()
      cancelScheduledActivation()
    }
  }
}
