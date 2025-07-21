import type { PropsWithChildren } from 'react';
import { GoogleTagManager, WebVitals } from '@nl/ui/gtm';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <GoogleTagManager />
      {children}
      <WebVitals />
    </>
  );
}
