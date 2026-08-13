import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'
import DeferredAnalytics from '@nl/ui/gtm/deferred'

export const metadata: Metadata = { title: 'Game Invite' }

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <DeferredAnalytics includeWebVitals={false} />
      {children}
    </>
  )
}
