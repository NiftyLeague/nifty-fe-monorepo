import { onMount } from 'solid-js'

import { loadGoogleTagManager } from '../loadGoogleTagManager'

/**
 * Loads GTM after the owning app has decided analytics is appropriate.
 * The DOM loader itself lives in `../loadGoogleTagManager`, so a non-component
 * surface (the Astro docs page) installs the identical container instead of
 * restating the id, URL, start push, and append.
 */
const GoogleTagManager = () => {
  onMount(() => {
    loadGoogleTagManager()
  })

  return null
}

export default GoogleTagManager
