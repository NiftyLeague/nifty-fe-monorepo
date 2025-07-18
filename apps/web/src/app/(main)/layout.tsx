import type { PropsWithChildren } from 'react';
import { GoogleTagManager } from '@nl/ui/gtm';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <GoogleTagManager />
      {children}
    </>
  );
}
