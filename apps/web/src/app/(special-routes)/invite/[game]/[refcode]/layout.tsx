import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { GoogleAnalyticsScript } from '@nl/ui/ga';

export const metadata: Metadata = { title: 'Game Invite' };

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <GoogleAnalyticsScript />
    </>
  );
}
