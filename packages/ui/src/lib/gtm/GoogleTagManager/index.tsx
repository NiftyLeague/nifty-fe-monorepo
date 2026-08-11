'use client'

import Script from 'next/script'
import { GOOGLE_TAG_MANAGER_ID } from '../constants'

const GOOGLE_TAG_MANAGER_SCRIPT = `https://www.googletagmanager.com/gtm.js?id=${GOOGLE_TAG_MANAGER_ID}`

const GoogleTagManager = () => (
  <>
    <Script
      id="_next-gtm-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
      (function(w,l){
        w[l]=w[l]||[];
        w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
      })(window,'dataLayer');`,
      }}
    />
    <Script id="_next-gtm" strategy="afterInteractive" src={GOOGLE_TAG_MANAGER_SCRIPT} />
  </>
)

export default GoogleTagManager
