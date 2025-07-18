'use client';

import type { NextWebVitalsMetric } from 'next/app';
import { sendGTMEvent } from '@next/third-parties/google';
import { CATEGORIES, EVENTS, EVENT_CATEGORIES } from './constants';
import type { CustomEventNames } from './constants';

const getUserID = () => {
  if (typeof window === 'undefined') return null;
  const userId = window.localStorage.getItem('user_id');
  return userId ?? null;
};

const getEventCategory = (name: EventName) => EVENT_CATEGORIES[name];

type EventName = CustomEventNames | (string & {});
interface EventParams {
  content_id?: string;
  content_type?: string;
  description?: string;
  event_category?: string;
  event_label?: string;
  method?: string;
  user_id?: string | null;
  value?: number;
}

// Send custom events to Google Tag Manager
// https://developers.google.com/tag-platform/tag-manager/datalayer
export const sendEvent = (event: EventName, params?: EventParams) => {
  const { event_category: category, user_id: userId, ...otherParams } = params ?? {};
  const event_category = category ?? getEventCategory(event);
  const user_id = userId ?? getUserID();
  sendGTMEvent({ event, event_category, user_id, ...otherParams });
};

/* =================================|| USER AUTH ||================================= */

export const sendUserId = (userId: string) => {
  if (!userId || typeof window === 'undefined') return;
  window.localStorage.setItem('user_id', userId);
  sendEvent(EVENTS.LOGIN);
};

export const removeUserId = () => {
  window.localStorage.removeItem('user_id');
  sendEvent(EVENTS.LOGOUT);
};

/* =================================|| REFERRALS ||================================= */

interface GameReferralParams extends EventParams {
  // Custom Dimensions
  game_name: string;
  invite_method: string;
  invitee_agent: string;
  redirect_route: string;
  referrer_id: string;
}

export const sendGameReferral = (params: GameReferralParams) => {
  sendEvent(EVENTS.GAME_REFERRAL, params);
};

/* =================================|| WEBVITALS ||================================= */

interface WebVitalsParams extends EventParams {
  // Required Dimensions
  event_category: string;
  event_label: string;
  value: number;
  non_interaction: boolean;
}

// Send Web Vitals or custom Next.js events to Google Tag Manager
// https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals
export const sendWebVitals = (metric: NextWebVitalsMetric) => {
  sendEvent(metric.name, {
    event_category: metric.label === 'web-vital' ? CATEGORIES.WEB_VITALS : CATEGORIES.NEXT_CUSTOM_METRICS,
    event_label: metric.id, // id unique to current page load
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value), // values must be integers
    non_interaction: true, // avoids affecting bounce rate.
  } as WebVitalsParams);
};
