import { redirect } from 'next/navigation'
import { getSession } from '@/utils/session'
import ProfileRoute from './ProfileRoute'

export default async function ProfilePage() {
  const session = await getSession()

  // redirect to login if not authorized
  if (!session.user?.isLoggedIn) {
    redirect('/login')
  }

  // Extract only the data we need from the session
  const sessionData = {
    user: session.user,
    // Add any other necessary session data here, but avoid methods
  }

  return <ProfileRoute sessionData={sessionData} />
}
