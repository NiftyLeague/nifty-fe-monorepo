import type { PropsWithChildren } from 'react'

import WalletContextWrapper from '@/contexts/WalletContextWrapper'

export default function VerificationLayout({ children }: PropsWithChildren) {
  return <WalletContextWrapper>{children}</WalletContextWrapper>
}
