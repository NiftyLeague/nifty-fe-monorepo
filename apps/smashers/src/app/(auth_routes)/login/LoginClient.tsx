'use client';

import { Suspense } from 'react';
import { PlayFabAuthForm } from '@nl/playfab/components';
import type { User } from '@nl/playfab/types';
import BackButton from '@/components/Header/BackButton';
import useFlags from '@/hooks/useFlags';
import SearchParamsHandler from './SearchParamsHandler';

interface SessionData {
  user: User | null;
}

export default function LoginClient({ sessionData }: { sessionData: SessionData }) {
  const { enableAccountCreation, enableProviderSignOn } = useFlags();

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
  );
}
