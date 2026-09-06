'use client'

import type { DegenDialogProps } from '@/components/dialog/DegenDialog'
import DeferredDegenDialog from './DeferredDegenDialog'
import WalletRouteProvider from './WalletRouteProvider'

export default function WalletDegenDialog(props: DegenDialogProps) {
  return (
    <WalletRouteProvider>
      <DeferredDegenDialog {...props} />
    </WalletRouteProvider>
  )
}
