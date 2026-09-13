'use client'

import type { PropsWithChildren } from 'react'

import DeferredComponent from '@nl/ui/custom/deferred-component'

type MintProvidersProps = PropsWithChildren<{ cookies?: string | null }>

const loadMintProviders = () => import('./MintProviders')

export default function DeferredMintProviders({ children, cookies }: MintProvidersProps) {
  return (
    <DeferredComponent
      label="Wallet provider"
      load={loadMintProviders}
      loadingFallback={children}
      errorFallback={() => children}
      props={{ cookies, children }}
    />
  )
}
