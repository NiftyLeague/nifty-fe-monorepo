'use client';

import { useParams, useRouter } from 'next/navigation';
import Loading from './Loading';

const isAndroid = (userAgent: string) => /.*(Mobile|Android).*/.test(userAgent);
const isIOS = (userAgent: string) => /.*(iPhone|iPad|iPod).*/.test(userAgent);

const redirectToAppStore = (userAgent: string, refcode: string, newTab = false) => {
  let appStoreURL = 'https://niftysmashers.com/steam';
  if (isAndroid(userAgent)) appStoreURL = `https://niftysmashers.com/android`;
  if (isIOS(userAgent)) appStoreURL = `https://niftysmashers.com/ios`;
  if (newTab) window.open(`${appStoreURL}/?referral=${refcode}`, '_blank');
  else window.location.href = `${appStoreURL}/?referral=${refcode}`;
};

// Attempt to launch App if installed. Fallback to App Store after a timeout
const redirectToNativeApp = (userAgent: string, refcode: string, partyID?: string) => {
  const timeoutId = setTimeout(() => redirectToAppStore(userAgent, refcode), 500);

  const clearTimeoutHandler = () => {
    clearTimeout(timeoutId);
    setTimeout(() => redirectToAppStore(userAgent, refcode, true), 5000);
    window.removeEventListener('beforeunload', clearTimeoutHandler);
  };

  // Clear the timeout if the page unloads (app opens)
  window.addEventListener('beforeunload', clearTimeoutHandler);

  // Attempt to launch the app
  if (partyID) window.location.href = `niftysmashers://smashers/party?profile=${refcode}&party=${partyID}`;
  else window.location.href = `niftysmashers://smashers/invite?profile=${refcode}`;
};

type RequestParams = { game: string; refcode: string; partyID?: string };

const InviteRedirect = () => {
  const router = useRouter();
  const params = useParams();

  const { game, refcode, partyID } = params as RequestParams;
  const userAgent = navigator.userAgent;

  switch (game) {
    case 'smashers':
      if (refcode.length > 7 && (isAndroid(userAgent) || isIOS(userAgent))) {
        redirectToNativeApp(userAgent, refcode, partyID);
      } else {
        redirectToAppStore(userAgent, refcode);
      }
      break;
    case 'royale':
    default:
      router.push('/');
  }

  return <Loading />;
};

export default InviteRedirect;
