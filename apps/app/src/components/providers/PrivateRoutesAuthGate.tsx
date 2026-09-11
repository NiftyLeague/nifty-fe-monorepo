'use client'

import { useEffect, type PropsWithChildren, type ReactNode } from 'react'
import { useRouter } from '@/runtime/navigation'

import { useAuthStatus } from '@/contexts/AuthStatusContext'
import { AUDIT_FIXTURE } from '@/runtime/env'

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
  const auditFixtureEnabled = AUDIT_FIXTURE
  const shouldLoadWallet = shouldLoadPrivateRoutesWallet(isLoggedIn, auditFixtureEnabled)

  useEffect(() => {
    if (!shouldLoadWallet) router.replace('/')
  }, [router, shouldLoadWallet])

  return shouldLoadWallet ? children : loading
}
