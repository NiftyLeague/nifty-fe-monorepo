'use client';

import ReactGA from 'react-ga4';
import type { UaEventOptions, InitOptions } from 'react-ga4/types/ga4';

const isDev = process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production';
const trackingId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || '';

interface GA_Options extends Omit<InitOptions, 'trackingId'> {
  nonce?: string;
  testMode?: boolean;
  gtagUrl?: string;
}

const initGA = () => {
  if (isDev) return;

  // GA4 now sends pageviews automatically. Turn off so we can call manually
  const options: GA_Options = { gtagOptions: { send_page_view: false } };
  if (typeof window !== 'undefined') {
    const userId = window.localStorage.getItem('user_id');
    if (userId) options.gtagOptions['user_id'] = userId;
  }
  ReactGA.initialize(trackingId, options);
  // Only send most events to GA4 unless locally specified otherwise
  ReactGA.set({ send_to: trackingId });
};

const sendEvent = (action: string, category: string, label: string = '') => {
  if (isDev || !action || !category) return;

  ReactGA.event({ action, category, label });
};

const sendPageView = (path: string) => {
  if (isDev || !path) return;

  ReactGA.send({ hitType: 'pageview', page: path });
};

const sendUserId = (userId: string) => {
  if (isDev || !userId) return;

  if (typeof window !== 'undefined') {
    window.localStorage.setItem('user_id', userId);
  }
  ReactGA.set({ userId });
};

const sendWebVitals = (options: UaEventOptions) => {
  if (isDev || !options.action || !options.category) return;

  ReactGA.event(options);
};

export { initGA, sendEvent, sendPageView, sendUserId, sendWebVitals };
