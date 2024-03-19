import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

export const metadata: Metadata = {
  title: 'NiftyDegen Model Viewer',
  description: 'Nifty League Degen 2D & 3D Asset',
};

export default function Layout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
