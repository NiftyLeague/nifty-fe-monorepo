import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'

import PublicContentContainer from '@/components/wrapper/PublicContentContainer'

export const metadata: Metadata = { title: 'Games' }

export default function Layout({ children }: PropsWithChildren) {
  return <PublicContentContainer>{children}</PublicContentContainer>
}
