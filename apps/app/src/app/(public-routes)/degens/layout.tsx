import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'

import AppQueryProvider from '@/query/AppQueryProvider'

export const metadata: Metadata = { title: 'Degens' }

export default function Layout({ children }: PropsWithChildren) {
  return <AppQueryProvider>{children}</AppQueryProvider>
}
