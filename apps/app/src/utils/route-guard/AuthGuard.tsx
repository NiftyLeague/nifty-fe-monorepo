'use client'

import { useEffect } from 'react'
import { useRouter } from '@/runtime/navigation'
import type { GuardProps } from '@/types'
import useAuth from '@/hooks/useAuth'
import { AUDIT_FIXTURE } from '@/runtime/env'

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const AuthGuard = ({ children }: GuardProps) => {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const auditFixtureEnabled = AUDIT_FIXTURE

  useEffect(() => {
    if (!auditFixtureEnabled && !isLoggedIn) router.replace('/')
  }, [auditFixtureEnabled, isLoggedIn, router])

  return children
}

export default AuthGuard
