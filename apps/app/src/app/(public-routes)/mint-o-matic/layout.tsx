import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'

import WalletMintContextWrapper from '@/contexts/WalletMintContextWrapper'

export const metadata: Metadata = { title: 'Mint-o-Matic' }

export default function Layout({ children }: PropsWithChildren) {
  return <WalletMintContextWrapper>{children}</WalletMintContextWrapper>
}
