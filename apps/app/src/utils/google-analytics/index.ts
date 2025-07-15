'use client';

import ReactGA from 'react-ga4';
import type { UaEventOptions, InitOptions } from 'react-ga4/types/ga4';

const isDev = process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production';
const measurementId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || '';

const initGA = () => {
  if (isDev) return;

  let options: InitOptions | {} = {};
  if (typeof window !== 'undefined') {
    const userId = window.localStorage.getItem('user-id');
    options = userId ? { gaOptions: { userId } } : {};
  }
  ReactGA.initialize(measurementId, options);
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
    window.localStorage.setItem('user-id', userId);
  }
  ReactGA.set({ userId });
};

const sendWebVitals = (options: UaEventOptions) => {
  if (isDev) return;

  ReactGA.event(options);
};

export { initGA, sendEvent, sendPageView, sendUserId, sendWebVitals };
