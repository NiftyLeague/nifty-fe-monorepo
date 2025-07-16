'use client';

const isDev = process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production';

type EventName = Gtag.EventNames | (string & {});
interface EventParams extends Gtag.EventParams {
  // Custom Dimensions
  game_name?: string;
  invite_method?: string;
  invitee_agent?: string;
  redirect_route?: string;
  referrer_id?: string;
}

// log custom events https://developers.google.com/tag-platform/gtagjs/reference#event
export const sendEvent = (name: EventName, params: EventParams) => {
  if (!isDev && typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
};

interface WebVitalsParams extends Gtag.EventParams {
  // Required Dimensions
  event_category: string;
  event_label: string;
  non_interaction: boolean;
  value: number;
}

// https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals
export const sendWebVitals = (name: EventName, params: WebVitalsParams) => {
  sendEvent(name, params);
};
