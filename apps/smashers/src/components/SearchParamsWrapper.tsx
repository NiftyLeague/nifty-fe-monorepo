'use client';

import { Suspense, ReactNode } from 'react';

export default function SearchParamsWrapper({ children }: { children: ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
