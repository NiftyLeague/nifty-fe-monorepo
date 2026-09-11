import type { BrowserOptions } from '@sentry/browser'

export type SentryInitOptions = BrowserOptions

type BrowserModule = typeof import('@sentry/browser')

let browserModulePromise: Promise<BrowserModule> | undefined
let initPromise: Promise<BrowserModule> | undefined
let initOptions: SentryInitOptions | undefined

export const loadSentry = (): Promise<BrowserModule> => {
  browserModulePromise ??= import('@sentry/browser')
  return browserModulePromise
}

const reportLoadError = (error: unknown) => {
  console.error('Failed to load the Sentry client SDK', error)
}

/** Initializes Sentry once, reusing the first option set it was given. */
export const initializeSentry = (options: SentryInitOptions): Promise<BrowserModule> => {
  const resolvedOptions = (initOptions ??= options)
  initPromise ??= loadSentry().then((sentry) => {
    sentry.init(resolvedOptions)
    return sentry
  })
  return initPromise
}

const getSentryForCapture = () => (initOptions ? initializeSentry(initOptions) : loadSentry())

export const captureException = (error: unknown, options?: SentryInitOptions): void => {
  const sentry = options ? initializeSentry(options) : getSentryForCapture()
  void sentry.then(({ captureException: capture }) => capture(error)).catch(reportLoadError)
}
