'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface HomeSearchParamsHandlerProps {
  onReferral: () => void;
}

export default function HomeSearchParamsHandler({ onReferral }: HomeSearchParamsHandlerProps) {
  const search = useSearchParams();

  useEffect(() => {
    if (search && search.has('referral')) {
      onReferral();
    }
  }, [search, onReferral]);

  return null;
}
