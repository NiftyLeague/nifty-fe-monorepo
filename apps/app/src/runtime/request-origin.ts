import { createIsomorphicFn } from '@tanstack/solid-start'
import { getRequestHeader } from '@tanstack/solid-start/server'

/**
 * The scheme+host of the current request, for code that must fetch the app's
 * own API with an absolute URL during SSR (relative URLs have no origin on
 * the server). Returns an empty origin on the client, where relative URLs
 * already resolve against the browser location.
 */
export const getRequestOrigin = createIsomorphicFn()
  .server(() => {
    // Edge proxies set x-forwarded-proto; local servers default to http.
    const proto = getRequestHeader('x-forwarded-proto') ?? 'http'
    const host = getRequestHeader('host') ?? 'localhost:3000'
    return `${proto}://${host}`
  })
  .client(() => '')
