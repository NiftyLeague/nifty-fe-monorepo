type ClientModule = typeof import('./client')
import type { SentryInitOptions } from './client'

import { registerRouterTransitionCapture, type RouterTransitionArgs } from './router-bridge'

let clientModulePromise: Promise<ClientModule> | undefined
let routerCaptureRegistered = false

const loadClient = (): Promise<ClientModule> => {
  clientModulePromise ??= import('./client')
  return clientModulePromise
}

const reportClientLoadError = (error: unknown): void => {
  console.error('Failed to load deferred Sentry client', error)
}

export function scheduleSentryInit(enabled: boolean, options: SentryInitOptions): void {
  if (!enabled || typeof window === 'undefined') return

  if (!routerCaptureRegistered) {
    routerCaptureRegistered = true
    registerRouterTransitionCapture((...args: RouterTransitionArgs) => {
      void loadClient()
        .then(({ captureRouterTransitionStart, initializeSentry }) =>
          initializeSentry(options).then(() => captureRouterTransitionStart(...args))
        )
        .catch(reportClientLoadError)
    })
  }

  const initialize = () => {
    void loadClient()
      .then(({ initializeSentry }) => initializeSentry(options))
      .catch(reportClientLoadError)
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(initialize, { timeout: 2000 })
  } else {
    globalThis.setTimeout(initialize, 0)
  }
}

export function captureException(error: unknown, options?: SentryInitOptions): void {
  void loadClient()
    .then(({ captureException: capture }) => capture(error, options))
    .catch(reportClientLoadError)
}

export function captureRouterTransitionStart(...args: RouterTransitionArgs): void {
  if (typeof window === 'undefined' || process.env.VERCEL_ENV !== 'production') return

  void loadClient()
    .then(({ captureRouterTransitionStart: capture }) => capture(...args))
    .catch(reportClientLoadError)
}
