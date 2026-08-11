import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'
import { headers } from 'next/headers'

import DeferredMintProviders from '@/components/providers/DeferredMintProviders'

export const metadata: Metadata = { title: 'Mint-o-Matic' }

export default async function Layout({ children }: PropsWithChildren) {
  const cookies = (await headers()).get('cookie')

  return <DeferredMintProviders cookies={cookies}>{children}</DeferredMintProviders>
}
