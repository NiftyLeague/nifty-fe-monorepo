'use client'

import dynamic from 'next/dynamic'

import { Skeleton } from '@nl/ui/base/skeleton'
import type { User } from '@nl/playfab/types'

type SessionData = {
  user: User
}

const ProfileClient = dynamic(() => import('./ProfileClient'), {
  ssr: false,
  loading: () => (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading profile</span>
      <Skeleton aria-hidden="true" className="h-[28rem] w-full max-w-[800px] rounded-xl" />
    </div>
  ),
})

export default function ProfileRoute({ sessionData }: { sessionData: SessionData }) {
  return <ProfileClient sessionData={sessionData} />
}
