import { type PropsWithChildren, Suspense } from 'react';

import AnalyticsScripts from '@/components/AnalyticsScripts';
import NavigationEvents from '@/components/NavigationEvents';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <NavigationEvents />
      </Suspense>
      <AnalyticsScripts />
    </>
  );
}
