import type { PropsWithChildren } from 'react';

import { AnalyticsScripts } from '@nl/ui/ga';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <AnalyticsScripts />
    </>
  );
}
