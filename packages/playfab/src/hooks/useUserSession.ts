'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

import type { User } from '../types';
import fetchJson from '../utils/fetchJson';

export function useUserSession({ redirectTo = '', redirectIfFound = false } = {}) {
  const router = useRouter();
  const { data: user, mutate: mutateUser } = useSWR<User>('/api/playfab/user/playfab-session', fetchJson);

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !user) return;

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user?.isLoggedIn)
    ) {
      router.push(redirectTo);
    }
  }, [user, redirectIfFound, redirectTo, router]);

  return { user, mutateUser };
}

export default useUserSession;
