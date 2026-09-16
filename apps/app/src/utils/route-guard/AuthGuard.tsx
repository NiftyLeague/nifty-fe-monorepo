import { createEffect } from 'solid-js'
import { useRouter } from '@/runtime/navigation'
import type { GuardProps } from '@/types'
import useAuth from '@/hooks/useAuth'
import { AUDIT_FIXTURE } from '@/runtime/env'

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const AuthGuard = (props: GuardProps) => {
  const router = useRouter()
  const auth = useAuth()
  const auditFixtureEnabled = AUDIT_FIXTURE

  createEffect(() => {
    if (!auditFixtureEnabled && !auth.isLoggedIn) router.replace('/')
  })

  return props.children
}

export default AuthGuard
