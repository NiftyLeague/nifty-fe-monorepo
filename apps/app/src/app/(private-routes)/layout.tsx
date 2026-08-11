import type { PropsWithChildren } from 'react'
import { headers } from 'next/headers'

import PrivateRoutesBoundary from '@/components/providers/PrivateRoutesBoundary'

export default async function PrivateRoutesLayout({ children }: PropsWithChildren) {
  const cookies = (await headers()).get('cookie')

  return <PrivateRoutesBoundary cookies={cookies}>{children}</PrivateRoutesBoundary>
}
