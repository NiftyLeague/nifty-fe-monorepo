import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { GoogleTagManager } from '@nl/ui/gtm';

export const metadata: Metadata = { title: 'Game Invite' };

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <GoogleTagManager />
      {children}
    </>
  );
}
