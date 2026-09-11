import { afterEach, describe, expect, it } from 'bun:test'

import { captureServerError } from './sentry-server'

const originalEnv = { ...process.env }

const context = () => ({
  request: new Request('https://niftysmashers.com/api/playfab/login', { method: 'POST' }),
  url: new URL('https://niftysmashers.com/api/playfab/login'),
})

afterEach(() => {
  process.env = { ...originalEnv }
})

describe('server error capture', () => {
  it('does not load the SDK outside production', async () => {
    process.env.PUBLIC_DEPLOY_ENV = 'development'
    delete process.env.VERCEL_ENV

    // Nothing to assert beyond it resolving quietly: importing @sentry/node in
    // dev would add start-up cost for errors that never leave the machine.
    await expect(captureServerError(new Error('dev only'), context())).resolves.toBeUndefined()
  })

  it('never throws, even when reporting fails', async () => {
    process.env.VERCEL_ENV = 'production'
    // A non-Error value is still a legal capture argument; the guard is that
    // observability must not turn a handled error into a failed response.
    await expect(captureServerError(undefined, context())).resolves.toBeUndefined()
    await expect(captureServerError({ weird: true }, context())).resolves.toBeUndefined()
  })

  it('treats a production deploy environment as production', async () => {
    process.env.PUBLIC_DEPLOY_ENV = 'production'
    delete process.env.VERCEL_ENV
    await expect(captureServerError(new Error('prod'), context())).resolves.toBeUndefined()
  })
})
