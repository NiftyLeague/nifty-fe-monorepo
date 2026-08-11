'use client'

import dynamic from 'next/dynamic'
import type { DegenDialogProps } from '@/components/dialog/DegenDialog'
import WalletRouteProvider from './WalletRouteProvider'

const DegenDialog = dynamic(() => import('@/components/dialog/DegenDialog'), {
  ssr: false,
  loading: () => (
    <div className="sr-only" role="status" aria-live="polite" aria-busy="true">
      Loading degen dialog
    </div>
  ),
})

export default function WalletDegenDialog(props: DegenDialogProps) {
  return (
    <WalletRouteProvider>
      <DegenDialog {...props} />
    </WalletRouteProvider>
  )
}
