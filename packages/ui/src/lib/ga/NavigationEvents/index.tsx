'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview } from '../actions';

export default function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const search = searchParams.toString();
    const url = `${pathname}${search ? `?${search}` : ''}`;
    pageview(url);
  }, [pathname, searchParams]);

  return null;
}
