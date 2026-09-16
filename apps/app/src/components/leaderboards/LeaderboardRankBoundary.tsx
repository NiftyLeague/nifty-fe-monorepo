import { Show } from 'solid-js'

import dynamic from '@/runtime/dynamic'

import { AuthStatusProvider, useAuthStatus } from '@/contexts/AuthStatusContext'

import type { LeaderboardRankActionProps } from './LeaderboardRankAction'

const LeaderboardRankAction = dynamic(() => import('./LeaderboardRankAction'), { ssr: false })

function AuthenticatedRankAction(props: LeaderboardRankActionProps) {
  const auth = useAuthStatus()

  return <Show when={auth.isLoggedIn}>{<LeaderboardRankAction {...props} />}</Show>
}

export default function LeaderboardRankBoundary(props: LeaderboardRankActionProps) {
  return (
    <AuthStatusProvider>
      <AuthenticatedRankAction {...props} />
    </AuthStatusProvider>
  )
}
