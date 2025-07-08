import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getSession } from '@/utils/session';

const Loading = () => (
  <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <h3>Loading Profile...</h3>
  </div>
);

// Dynamically import the ProfileClient component with loading fallback
const ProfileClient = dynamic(() => import('./ProfileClient'), {
  loading: Loading,
  ssr: true, // Keep server-side rendering for initial load performance
});

export default async function ProfilePage() {
  const session = await getSession();

  if (!session.user?.isLoggedIn) {
    redirect('/login');
  }

  // Extract only the necessary user data to avoid serialization issues
  const userData = { ...session.user };

  return (
    <Suspense fallback={<Loading />}>
      <ProfileClient user={userData} />
    </Suspense>
  );
}
