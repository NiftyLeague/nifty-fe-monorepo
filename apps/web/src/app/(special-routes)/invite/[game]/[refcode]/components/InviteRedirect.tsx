'use client';

import { useEffect } from 'react';
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

const redirectToNativeApp = (userAgent: string, profileId: string) => {
  // Attempt to launch App if installed. Fallback to App Store after a timeout
  setTimeout(() => redirectToAppStore(userAgent, profileId), 500);
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

  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Loading />;
};

export default InviteRedirect;
