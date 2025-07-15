'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useReportWebVitals } from 'next/web-vitals';
import { initGA, sendPageView, sendWebVitals } from '@/utils/google-analytics';

const useGoogleAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    const search = searchParams.toString();
    const url = `${pathname}${search ? `?${search}` : ''}`;
    sendPageView(url);
  }, [pathname, searchParams]);

  useReportWebVitals(metric => {
    sendWebVitals({
      category: 'Web Vitals',
      action: metric.name,
      label: metric.id, // id unique to current page load
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value), // values must be integers
      nonInteraction: true, // avoids affecting bounce rate.
    });
  });
};

export default useGoogleAnalytics;
