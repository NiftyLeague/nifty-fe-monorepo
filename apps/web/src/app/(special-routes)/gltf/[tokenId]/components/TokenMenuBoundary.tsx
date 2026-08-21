'use client'

import dynamic from 'next/dynamic'
import type { PropsWithChildren } from 'react'

import { ErrorBoundary } from '@nl/ui/custom/error-boundry'

import type { TokenMenuProps } from './TokenMenu'

const TokenMenu = dynamic(() => import('./TokenMenu'), { ssr: false })

export function TokenMenuErrorBoundary({ children }: PropsWithChildren) {
  return <ErrorBoundary>{children}</ErrorBoundary>
}

export default function TokenMenuBoundary(props: TokenMenuProps) {
  return (
    <TokenMenuErrorBoundary>
      <TokenMenu {...props} />
    </TokenMenuErrorBoundary>
  )
}
