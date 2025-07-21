import { useRef } from 'react';
import type { NextWebVitalsMetric } from 'next/app';
import { useReportWebVitals as useNextWebVitals } from 'next/web-vitals';
import { sendWebVitals } from '../events';

/**
 * Custom hook to report Web Vitals metrics to Google Tag Manager.
 * Ensures that each metric is reported only once per page load.
 */
export const useReportWebVitals = () => {
  const webVitalsReported = useRef<Set<NextWebVitalsMetric['name']>>(new Set());
  useNextWebVitals(metric => {
    if (webVitalsReported.current.has(metric.name)) return;
    webVitalsReported.current.add(metric.name);
    sendWebVitals(metric);
  });
};

export default useReportWebVitals;
