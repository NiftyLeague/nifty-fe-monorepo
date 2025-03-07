'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

import Loading from '@/components/Invite/Loading';

const InviteRedirect = dynamic(() => import('@/components/Invite/InviteRedirect'), { ssr: false });

const PageWrapper = () => {
  return (
    <Suspense fallback={<Loading />}>
      <InviteRedirect />
    </Suspense>
  );
};

export default PageWrapper;
