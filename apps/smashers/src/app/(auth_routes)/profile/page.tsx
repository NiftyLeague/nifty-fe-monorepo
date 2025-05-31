import { redirect } from 'next/navigation';
import { getSession } from '@/utils/session';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the ProfileClient component with loading fallback
const ProfileClient = dynamic(() => import('./ProfileClient'), {
  loading: () => <div style={{ padding: '20px', textAlign: 'center' }}>Loading profile...</div>,
  ssr: true, // Keep server-side rendering for initial load performance
});

export default async function ProfilePage() {
  const session = await getSession();

  if (!session.user?.isLoggedIn) {
    redirect('/login');
  }

  // Extract only the necessary user data to avoid serialization issues
  const userData = {
    ...session.user,
    // Ensure we're only passing serializable data
  };

  return (
    <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Loading profile...</div>}>
      <ProfileClient user={userData} />
    </Suspense>
  );
}
