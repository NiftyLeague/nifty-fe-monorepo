import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'

import WalletContextWrapper from '@/contexts/WalletContextWrapper'

export const metadata: Metadata = { title: 'Degens' }

export default function Layout({ children }: PropsWithChildren) {
  return <WalletContextWrapper>{children}</WalletContextWrapper>
}
