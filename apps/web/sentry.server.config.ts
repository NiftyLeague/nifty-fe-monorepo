// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://97a944f1560b45018f013090ced577b3@o1377979.ingest.us.sentry.io/4504089815351296',

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1.0, // Set tracesSampleRate to 1.0 to capture 100%

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
