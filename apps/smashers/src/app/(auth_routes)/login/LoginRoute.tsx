'use client'

import dynamic from 'next/dynamic'
import type { User } from '@nl/playfab/types'
import { Skeleton } from '@nl/ui/base/skeleton'

const LoginClient = dynamic(() => import('./LoginClient'), {
  ssr: false,
  loading: () => (
    <div
      className="flex min-h-screen w-full items-center justify-center px-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Skeleton aria-hidden="true" className="h-[30rem] w-full max-w-[600px]" />
      <span className="sr-only">Loading sign-in form</span>
    </div>
  ),
})

interface SessionData {
  user: User | null
}

export default function LoginRoute({ sessionData }: { sessionData: SessionData }) {
  return <LoginClient sessionData={sessionData} />
}
