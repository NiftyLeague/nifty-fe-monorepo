import { type PropsWithChildren, Suspense } from 'react';

import { AnalyticsScripts, NavigationEvents } from '@nl/ui/ga';

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
