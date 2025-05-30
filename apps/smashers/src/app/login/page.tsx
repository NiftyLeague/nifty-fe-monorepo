import { redirect } from 'next/navigation';
import { getSession } from '@/utils/session';
import LoginClient from './LoginClient';

export default async function LoginPage() {
  const session = await getSession();
  const hasGameToken = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').has(
    'game-token',
  );

  // clear session and don't redirect
  if (hasGameToken) {
    session.destroy();
  }
  // redirect to profile if already logged in
  if (session.user?.isLoggedIn) {
    redirect('/profile');
  }

  return <LoginClient />;
}
