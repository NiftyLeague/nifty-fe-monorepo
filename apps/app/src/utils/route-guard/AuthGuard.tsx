'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { GuardProps } from '@/types'
import useAuth from '@/hooks/useAuth'

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const AuthGuard = ({ children }: GuardProps) => {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const auditFixtureEnabled = process.env.NEXT_PUBLIC_AUDIT_FIXTURE === 'true'

  useEffect(() => {
    if (!auditFixtureEnabled && !isLoggedIn) router.replace('/')
  }, [auditFixtureEnabled, isLoggedIn, router])

  return children
}

export default AuthGuard
