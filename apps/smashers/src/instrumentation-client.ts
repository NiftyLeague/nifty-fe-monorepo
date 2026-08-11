// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { captureRouterTransitionStart, scheduleSentryInit } from '@nl/sentry-client/client'

scheduleSentryInit(process.env.VERCEL_ENV === 'production', {
  dsn: 'https://34e7ae2cd1c7fb58c7aeace4dd19fc3a@o1377979.ingest.us.sentry.io/4506384689659904',
  sendDefaultPii: true,
  tracesSampleRate: 0.1,
  debug: false,
})

export const onRouterTransitionStart = captureRouterTransitionStart
