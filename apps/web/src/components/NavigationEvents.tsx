'use client';

import { useEffect } from 'react';
import * as ga from '@/lib/ga';
import { usePathname, useSearchParams } from 'next/navigation';

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleRouteChange = (url: string) => ga.pageview(url);
    const url = `${pathname}?${searchParams}`;
    handleRouteChange(url);
  }, [pathname, searchParams]);

  return null;
}

export default NavigationEvents;
