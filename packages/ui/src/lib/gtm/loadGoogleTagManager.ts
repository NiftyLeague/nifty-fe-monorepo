import { GOOGLE_TAG_MANAGER_ID } from './constants'
import { pushToDataLayer } from './dataLayer'

/**
 * The id every surface has used for the container script since the Next build.
 * It is kept verbatim so a page that already loaded GTM is never loaded twice,
 * whichever app or era installed it.
 */
export const GOOGLE_TAG_MANAGER_SCRIPT_ID = '_next-gtm'

export const googleTagManagerScriptUrl = (containerId: string = GOOGLE_TAG_MANAGER_ID) =>
  `https://www.googletagmanager.com/gtm.js?id=${containerId}`

/**
 * Bootstraps Google Tag Manager once per document: start the data layer, then
 * append the async container script.
 *
 * Framework-neutral by design. The shared React boundary and the Astro docs
 * page both need the same script id, the same `gtm.js` start push, and the same
 * append; keeping this function free of React is what lets a non-React surface
 * reuse it instead of restating the loader. Callers own the schedule — whether
 * this runs on idle, on an interaction, or immediately is an app decision.
 *
 * Returns whether this call installed the script.
 */
export const loadGoogleTagManager = (): boolean => {
  if (typeof document === 'undefined') return false
  if (document.getElementById(GOOGLE_TAG_MANAGER_SCRIPT_ID)) return false

  pushToDataLayer({ 'gtm.start': Date.now(), event: 'gtm.js' })

  const script = document.createElement('script')
  script.id = GOOGLE_TAG_MANAGER_SCRIPT_ID
  script.async = true
  script.src = googleTagManagerScriptUrl()
  document.head.appendChild(script)

  return true
}
