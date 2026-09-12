import { createIsomorphicFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'

/**
 * The raw `Cookie` request header, read on the server during SSR and from
 * `document.cookie` after hydration.
 *
 * Wallet providers hydrate their persisted connection state from this value, so
 * the server render and the first client render must agree on it. Returning the
 * live client value on the browser keeps client-side navigations from dropping
 * a connection that the server had baked into the HTML.
 */
export const getRequestCookieHeader = createIsomorphicFn()
  .server(() => getRequestHeader('cookie') ?? null)
  .client(() => (typeof document === 'undefined' ? null : document.cookie || null))

export default getRequestCookieHeader
