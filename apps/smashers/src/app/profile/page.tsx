import { redirect } from 'next/navigation';
import { getSession } from '@/utils/session';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const session = await getSession();

  if (!session.user?.isLoggedIn) {
    redirect('/login');
  }

  return <ProfileClient user={session.user} />;
}
