'use client'

import { useEffect, type PropsWithChildren, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'

import { useAuthStatus } from '@/contexts/AuthStatusContext'

export function shouldLoadPrivateRoutesWallet(
  isLoggedIn: boolean,
  auditFixtureEnabled: boolean
): boolean {
  return auditFixtureEnabled || isLoggedIn
}

interface PrivateRoutesAuthGateProps extends PropsWithChildren {
  loading: ReactNode
}

export default function PrivateRoutesAuthGate({
  children,
  loading,
}: PrivateRoutesAuthGateProps): ReactNode {
  const router = useRouter()
  const { isLoggedIn } = useAuthStatus()
  const auditFixtureEnabled = process.env.NEXT_PUBLIC_AUDIT_FIXTURE === 'true'
  const shouldLoadWallet = shouldLoadPrivateRoutesWallet(isLoggedIn, auditFixtureEnabled)

  useEffect(() => {
    if (!shouldLoadWallet) router.replace('/')
  }, [router, shouldLoadWallet])

  return shouldLoadWallet ? children : loading
}
