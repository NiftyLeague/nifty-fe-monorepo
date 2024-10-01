'use client';

import ReactGA from 'react-ga4';

const initGA = () => {
  const isDev = !process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production';
  if (isDev) {
    return;
  }
  if (typeof window !== 'undefined') {
    const userId = window.localStorage.getItem('user-id');
    ReactGA.initialize(
      process.env.NEXT_PUBLIC_GA_CONTAINER_ID || '',
      userId
        ? {
            gaOptions: {
              userId: userId,
            },
          }
        : undefined,
    );
  }
};

const sendEvent = (action = '', category = '', label = '') => {
  if (category && action) {
    ReactGA.event(action, { category, label });
  }
};

const sendPageview = (path: string) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};

const sendUserId = (userId: string) => {
  if (typeof window !== 'undefined') window.localStorage.setItem('user-id', userId);
  ReactGA.set({ userId });
};

export { initGA, sendEvent, sendPageview, sendUserId };
