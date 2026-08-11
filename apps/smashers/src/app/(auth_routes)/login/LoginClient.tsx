'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import type { User } from '@nl/playfab/types'
import { Skeleton } from '@nl/ui/base/skeleton'
import BackButton from '@/components/Header/BackButton'
import useFlags from '@/hooks/useFlags'
import SearchParamsHandler from './SearchParamsHandler'

const PlayFabAuthForm = dynamic(() => import('@nl/playfab/components/PlayFabAuthForm'), {
  ssr: false,
  loading: () => (
    <div
      className="flex min-h-screen w-full items-center justify-center px-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Skeleton className="h-[30rem] w-full max-w-[600px]" />
      <span className="sr-only">Loading sign-in form</span>
    </div>
  ),
})

interface SessionData {
  user: User | null
}

export default function LoginClient({ sessionData }: { sessionData: SessionData }) {
  const { enableAccountCreation, enableProviderSignOn } = useFlags()

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsHandler sessionData={sessionData} />
      </Suspense>
      <BackButton />
      <PlayFabAuthForm
        enableAccountCreation={enableAccountCreation}
        enableProviderSignOn={enableProviderSignOn}
        redirectTo="/profile"
        view="login"
      />
    </>
  )
}
