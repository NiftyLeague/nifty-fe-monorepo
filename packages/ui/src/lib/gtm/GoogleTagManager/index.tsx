'use client'

import { useEffect } from 'react'

import { GOOGLE_TAG_MANAGER_ID } from '../constants'
import { pushToDataLayer } from '../dataLayer'

const GOOGLE_TAG_MANAGER_SCRIPT = `https://www.googletagmanager.com/gtm.js?id=${GOOGLE_TAG_MANAGER_ID}`
const GOOGLE_TAG_MANAGER_SCRIPT_ID = '_next-gtm'

/**
 * Loads GTM after the owning app has decided analytics is appropriate.
 * Keeping the DOM loader framework-neutral lets the shared deferred boundary
 * work in both Next and Docusaurus without carrying next/script into docs.
 */
const GoogleTagManager = () => {
  useEffect(() => {
    if (document.getElementById(GOOGLE_TAG_MANAGER_SCRIPT_ID)) return

    pushToDataLayer({ 'gtm.start': Date.now(), event: 'gtm.js' })

    const script = document.createElement('script')
    script.id = GOOGLE_TAG_MANAGER_SCRIPT_ID
    script.async = true
    script.src = GOOGLE_TAG_MANAGER_SCRIPT
    document.head.appendChild(script)
  }, [])

  return null
}

export default GoogleTagManager
