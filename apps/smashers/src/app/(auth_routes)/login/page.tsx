import { redirect } from 'next/navigation';
import { getSession } from '@/utils/session';
import LoginClient from './LoginClient';
import { Suspense } from 'react';

export default async function LoginPage() {
  const session = await getSession();

  // redirect to profile if already logged in
  if (session.user?.isLoggedIn) {
    redirect('/profile');
  }

  // Extract only the data we need from the session
  const sessionData = {
    user: session.user || null,
    // Add any other necessary session data here, but avoid methods
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginClient sessionData={sessionData} />
    </Suspense>
  );
}
