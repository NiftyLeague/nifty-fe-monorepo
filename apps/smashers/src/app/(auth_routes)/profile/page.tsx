import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/utils/session';
import Loading from '@nl/ui/custom/Loading';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const session = await getSession();

  // redirect to login if not authorized
  if (!session.user?.isLoggedIn) {
    redirect('/login');
  }

  // Extract only the data we need from the session
  const sessionData = {
    user: session.user,
    // Add any other necessary session data here, but avoid methods
  };

  return (
    <Suspense fallback={<Loading />}>
      <ProfileClient sessionData={sessionData} />
    </Suspense>
  );
}
