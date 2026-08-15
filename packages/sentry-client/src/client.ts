type SentryModule = typeof import('@sentry/nextjs')
type DeferredSentryModule = typeof import('./nextjs-client')
export type SentryInitOptions = Parameters<SentryModule['init']>[0]
type RouterTransitionArgs = Parameters<SentryModule['captureRouterTransitionStart']>

let sentryModulePromise: Promise<DeferredSentryModule> | undefined
let sentryInitPromise: Promise<DeferredSentryModule> | undefined
let sentryInitOptions: SentryInitOptions | undefined

export function loadSentry(): Promise<DeferredSentryModule> {
  sentryModulePromise ??= import('./nextjs-client')
  return sentryModulePromise
}

const reportSentryLoadError = (error: unknown): void => {
  console.error('Failed to load Sentry client SDK', error)
}

export function initializeSentry(options: SentryInitOptions): Promise<DeferredSentryModule> {
  const initOptions = (sentryInitOptions ??= options)
  sentryInitPromise ??= loadSentry().then((sentry) => {
    sentry.init(initOptions)
    return sentry
  })
  return sentryInitPromise
}

function getSentryForCapture(): Promise<DeferredSentryModule> {
  return sentryInitOptions ? initializeSentry(sentryInitOptions) : loadSentry()
}

export function captureException(error: unknown, options?: SentryInitOptions): void {
  const sentry = options ? initializeSentry(options) : getSentryForCapture()
  void sentry.then(({ captureException: capture }) => capture(error)).catch(reportSentryLoadError)
}

export function captureRouterTransitionStart(...args: RouterTransitionArgs): void {
  if (typeof window === 'undefined' || process.env.VERCEL_ENV !== 'production') return

  void getSentryForCapture()
    .then(({ captureRouterTransitionStart: capture }) => capture(...args))
    .catch(reportSentryLoadError)
}
