import { afterEach, describe, expect, it } from 'bun:test'

import { scheduleDeferredActivation } from './deferred-activation'

/**
 * The activation primitive is shared by the app's deferred boundaries and by the
 * web/smashers telemetry modules. The latter want "first idle period, ceiling
 * 3s" rather than the default "wait 5s, then idle", which is what the
 * `idleTimeout` option is for.
 */
const realRequestIdleCallback = window.requestIdleCallback
const cleanups: (() => void)[] = []

interface IdleCall {
  callback: () => void
  timeout: number | undefined
}

const captureIdleCalls = (): IdleCall[] => {
  const calls: IdleCall[] = []
  window.requestIdleCallback = ((callback: () => void, options?: { timeout?: number }) => {
    calls.push({ callback, timeout: options?.timeout })
    return calls.length
  }) as typeof window.requestIdleCallback
  return calls
}

const tick = () => new Promise((resolve) => window.setTimeout(resolve, 5))

afterEach(() => {
  for (const cleanup of cleanups.splice(0)) cleanup()
  window.requestIdleCallback = realRequestIdleCallback
})

describe('scheduleDeferredActivation', () => {
  it('activates on the first interaction event', async () => {
    captureIdleCalls()
    let activated = false
    cleanups.push(scheduleDeferredActivation({ onActivate: () => (activated = true) }))

    window.dispatchEvent(new Event('pointerdown'))

    expect(activated).toBe(true)
  })

  it('uses the caller idle ceiling when the delay is zero', async () => {
    const idleCalls = captureIdleCalls()
    let activated = false
    cleanups.push(
      scheduleDeferredActivation({
        delay: 0,
        idleTimeout: 3000,
        onActivate: () => (activated = true),
      })
    )

    await tick()

    expect(idleCalls).toHaveLength(1)
    expect(idleCalls[0]?.timeout).toBe(3000)
    expect(activated, 'the idle callback has not run yet').toBe(false)

    idleCalls[0]?.callback()

    expect(activated).toBe(true)
  })

  it('keeps the default 1s idle ceiling behind the default delay', async () => {
    const idleCalls = captureIdleCalls()
    let activated = false
    cleanups.push(scheduleDeferredActivation({ onActivate: () => (activated = true) }))

    await tick()

    // The default delays the idle request, so nothing is asked for yet.
    expect(idleCalls).toHaveLength(0)
    expect(activated).toBe(false)
  })
})
