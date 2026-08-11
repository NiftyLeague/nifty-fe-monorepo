import type { PropsWithChildren } from 'react'

import WalletAuthContextWrapper from '@/contexts/WalletAuthContextWrapper'

export default function VerificationLayout({ children }: PropsWithChildren) {
  return <WalletAuthContextWrapper>{children}</WalletAuthContextWrapper>
}
