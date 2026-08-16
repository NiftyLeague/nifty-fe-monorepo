'use client'

import dynamic from 'next/dynamic'

import { AuthStatusProvider, useAuthStatus } from '@/contexts/AuthStatusContext'

import type { LeaderboardRankActionProps } from './LeaderboardRankAction'

const LeaderboardRankAction = dynamic(() => import('./LeaderboardRankAction'), { ssr: false })

function AuthenticatedRankAction(props: LeaderboardRankActionProps) {
  const { isLoggedIn } = useAuthStatus()

  return isLoggedIn ? <LeaderboardRankAction {...props} /> : null
}

export default function LeaderboardRankBoundary(props: LeaderboardRankActionProps) {
  return (
    <AuthStatusProvider>
      <AuthenticatedRankAction {...props} />
    </AuthStatusProvider>
  )
}
