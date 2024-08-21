'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

import Loading from './components/Loading';

const InviteRedirect = dynamic(() => import('./components/InviteRedirect'), { ssr: false });

const PageWrapper = () => {
  return (
    <Suspense fallback={<Loading />}>
      <InviteRedirect />
    </Suspense>
  );
};

export default PageWrapper;
