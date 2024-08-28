'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Loading from './Loading';

const isAndroid = (userAgent: string) => /.*(Mobile|Android).*/.test(userAgent);
const isIOS = (userAgent: string) => /.*(iPhone|iPad|iPod).*/.test(userAgent);

const redirectToAppStore = (userAgent: string, referral: string) => {
  let appStoreURL = 'https://niftysmashers.com';
  if (isAndroid(userAgent)) appStoreURL = `https://niftysmashers.com/android`;
  if (isIOS(userAgent)) appStoreURL = `https://niftysmashers.com/ios`;
  window.location.href = `${appStoreURL}/?referral=${referral}`;
};

// Attempt to launch App if installed. Fallback to App Store after a timeout
const redirectToNativeApp = (userAgent: string, profileId: string) => {
  const timeoutId = setTimeout(() => redirectToAppStore(userAgent, profileId), 1500);

  const clearTimeoutHandler = () => {
    clearTimeout(timeoutId);
    document.removeEventListener('visibilitychange', clearTimeoutHandler);
    window.removeEventListener('beforeunload', clearTimeoutHandler);
    window.removeEventListener('blur', clearTimeoutHandler);
    window.removeEventListener('pagehide', clearTimeoutHandler);
  };

  // Clear the timeout if the page becomes hidden (app opens) or blurred (popup opens)
  document.addEventListener('visibilitychange', clearTimeoutHandler);
  window.addEventListener('beforeunload', clearTimeoutHandler);
  window.addEventListener('blur', clearTimeoutHandler);
  window.addEventListener('pagehide', clearTimeoutHandler);

  // Attempt to launch the app
  window.location.href = `nifty://niftysmashers/invite?profile=${profileId}`;
};

type RequestParams = { game: string; refcode: string };

const InviteRedirect = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const { game, refcode } = params as RequestParams;
  const profileId = searchParams.get('profile');
  const userAgent = navigator.userAgent;

  switch (game) {
    case 'smashers':
      if (profileId && (isAndroid(userAgent) || isIOS(userAgent))) {
        redirectToNativeApp(userAgent, profileId);
      } else {
        redirectToAppStore(userAgent, refcode);
      }
      break;
    default:
      router.push('/');
  }

  return <Loading />;
};

export default InviteRedirect;
