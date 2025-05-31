'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { User } from '@nl/playfab/types';

interface SessionData {
  user: User | null;
}

export default function SearchParamsHandler({ sessionData }: { sessionData: SessionData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasGameToken = searchParams.has('game-token');

  useEffect(() => {
    if (hasGameToken) {
      // Instead of session.destroy(), we'll handle this client-side
      // by making a fetch request to logout endpoint
      fetch('/api/playfab/logout', { method: 'POST' })
        .then(() => {
          // Refresh the page to reflect the logged out state
          router.refresh();
        })
        .catch(console.error);
    }
  }, [hasGameToken, router]);

  return null;
}
