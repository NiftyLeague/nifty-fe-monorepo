import type { PropsWithChildren } from 'react'
import { DeferredAnalytics } from '@nl/ui/gtm'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <DeferredAnalytics />
      {children}
    </>
  )
}
