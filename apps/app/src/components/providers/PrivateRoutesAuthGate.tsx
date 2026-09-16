import { createEffect, Show, type JSX } from 'solid-js'
import { useRouter } from '@/runtime/navigation'

import { useAuthStatus } from '@/contexts/AuthStatusContext'
import { AUDIT_FIXTURE } from '@/runtime/env'

export function shouldLoadPrivateRoutesWallet(
  isLoggedIn: boolean,
  auditFixtureEnabled: boolean
): boolean {
  return auditFixtureEnabled || isLoggedIn
}

interface PrivateRoutesAuthGateProps {
  children?: JSX.Element
  loading: JSX.Element
}

export default function PrivateRoutesAuthGate(props: PrivateRoutesAuthGateProps): JSX.Element {
  const router = useRouter()
  const auth = useAuthStatus()
  const auditFixtureEnabled = AUDIT_FIXTURE
  const shouldLoadWallet = () => shouldLoadPrivateRoutesWallet(auth.isLoggedIn, auditFixtureEnabled)

  createEffect(() => {
    if (!shouldLoadWallet()) router.replace('/')
  })

  return <Show when={shouldLoadWallet()} fallback={props.loading}>{props.children}</Show>
}
