import type { PropsWithChildren } from 'react'

import { GOOGLE_TAG_MANAGER_ID } from '@nl/ui/gtm/constants'
import DeferredGoogleTagManager from '@nl/ui/gtm/deferred-manager'

export default function Root({ children }: PropsWithChildren) {
  return (
    <>
      <DeferredGoogleTagManager />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GOOGLE_TAG_MANAGER_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
          title="Google Tag Manager"
        />
      </noscript>
      {children}
    </>
  )
}
