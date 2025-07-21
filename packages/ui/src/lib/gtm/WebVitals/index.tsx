'use client';

import { Suspense } from 'react';
import { useReportWebVitals } from './useReportWebVitals';

const WebVitals = () => {
  useReportWebVitals();
  return null;
};

export default function WithSuspense() {
  return (
    <Suspense fallback={null}>
      <WebVitals />
    </Suspense>
  );
}
