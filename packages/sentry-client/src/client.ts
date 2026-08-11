type SentryModule = typeof import('@sentry/nextjs')
type SentryInitOptions = Parameters<SentryModule['init']>[0]
type RouterTransitionArgs = Parameters<SentryModule['captureRouterTransitionStart']>

let sentryModulePromise: Promise<SentryModule> | undefined
let sentryInitPromise: Promise<SentryModule> | undefined
let sentryInitOptions: SentryInitOptions | undefined

export function loadSentry(): Promise<SentryModule> {
  sentryModulePromise ??= import('@sentry/nextjs')
  return sentryModulePromise
}

const reportSentryLoadError = (error: unknown): void => {
  console.error('Failed to load Sentry client SDK', error)
}

function initializeSentry(options: SentryInitOptions): Promise<SentryModule> {
  const initOptions = (sentryInitOptions ??= options)
  sentryInitPromise ??= loadSentry().then((sentry) => {
    sentry.init(initOptions)
    return sentry
  })
  return sentryInitPromise
}

function getSentryForCapture(): Promise<SentryModule> {
  return sentryInitOptions ? initializeSentry(sentryInitOptions) : loadSentry()
}

export function scheduleSentryInit(enabled: boolean, options: SentryInitOptions): void {
  if (!enabled || typeof window === 'undefined') return

  const initialize = () => {
    void initializeSentry(options).catch(reportSentryLoadError)
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(initialize, { timeout: 2000 })
  } else {
    globalThis.setTimeout(initialize, 0)
  }
}

export function captureException(error: unknown): void {
  void getSentryForCapture()
    .then(({ captureException: capture }) => capture(error))
    .catch(reportSentryLoadError)
}

export function captureRouterTransitionStart(...args: RouterTransitionArgs): void {
  if (typeof window === 'undefined' || process.env.VERCEL_ENV !== 'production') return

  void getSentryForCapture()
    .then(({ captureRouterTransitionStart: capture }) => capture(...args))
    .catch(reportSentryLoadError)
}
