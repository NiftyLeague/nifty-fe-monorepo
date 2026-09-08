import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'

import PublicContentContainer from '@/components/wrapper/PublicContentContainer'
import AppQueryProvider from '@/query/AppQueryProvider'

export const metadata: Metadata = { title: 'Leaderboards' }

export default function Layout({ children }: PropsWithChildren) {
  return (
    <AppQueryProvider>
      <PublicContentContainer>{children}</PublicContentContainer>
    </AppQueryProvider>
  )
}
