import type { PropsWithChildren } from 'react'
import DeferredAnalytics from '@nl/ui/gtm/deferred'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <DeferredAnalytics />
      {children}
    </>
  )
}
