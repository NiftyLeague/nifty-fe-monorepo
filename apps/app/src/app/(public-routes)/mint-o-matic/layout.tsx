import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

export const metadata: Metadata = { title: 'Mint-o-Matic' };

export default function Layout({ children }: PropsWithChildren) {
  return children;
}
