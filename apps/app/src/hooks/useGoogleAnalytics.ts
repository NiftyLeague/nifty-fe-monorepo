'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useReportWebVitals } from 'next/web-vitals';
import { initGA, sendPageview } from '@/utils/google-analytics';

declare global {
  interface Window {
    ga?: (command: string, ...args: unknown[]) => void;
  }
}

const useGoogleAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    const currentPath = pathname + searchParams.toString();
    if (typeof window !== 'undefined' && 'ga' in window && typeof window.ga === 'function') {
      sendPageview(currentPath);
    }
  }, [pathname, searchParams]);

  useReportWebVitals(metric => {
    if (typeof window !== 'undefined' && window?.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value), // values must be integers
        event_label: metric.id, // id unique to current page load
        non_interaction: true, // avoids affecting bounce rate.
      });
    }
  });
};

export default useGoogleAnalytics;
