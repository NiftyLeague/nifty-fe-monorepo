// log the pageview with their URL
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && !window.location.host.includes('localhost')) {
    window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS as string, { page_path: url });
  }
};
// log specific events happening.

export const event = ({ action, params }: { action: string; params: Gtag.EventParams }) => {
  if (typeof window !== 'undefined' && !window.location.host.includes('localhost')) {
    window.gtag('event', action, params);
  }
};
