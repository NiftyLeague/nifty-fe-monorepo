'use client'

import dynamic from 'next/dynamic'

import type { DegenDialogProps } from '@/components/dialog/DegenDialog'

const DegenDialog = dynamic(() => import('@/components/dialog/DegenDialog'), {
  ssr: false,
  loading: () => (
    <div className="sr-only" role="status" aria-live="polite" aria-busy="true">
      Loading degen details
    </div>
  ),
})

export default function DeferredDegenDialog(props: DegenDialogProps) {
  return <DegenDialog {...props} />
}
