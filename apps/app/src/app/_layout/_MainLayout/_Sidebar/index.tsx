import dynamic from 'next/dynamic'

import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import useAuth from '@/hooks/useAuth'
import MenuList from './_MenuList'
import SidebarFrame from './SidebarFrame'

function UserProfileLoading() {
  return (
    <div
      className="mb-4 flex flex-col items-center rounded-lg bg-muted p-4"
      style={{ border: 'var(--border-default)' }}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading profile and login controls"
    >
      <DeferredSkeleton className="size-20 rounded-full" />
      <DeferredSkeleton className="my-2 h-5 w-32" />
      <DeferredSkeleton className="h-9 w-full rounded-md" />
    </div>
  )
}

const UserProfile = dynamic(() => import('./_UserProfile'), {
  ssr: false,
  loading: () => <UserProfileLoading />,
})

const LogoutButton = dynamic(() => import('./_LogoutButton'), { ssr: false })

function SidebarReadyContent() {
  const { isLoggedIn } = useAuth()

  return (
    <>
      <UserProfile />
      <MenuList isLoggedIn={isLoggedIn} />
    </>
  )
}

// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = ({ walletReady = true }: { walletReady?: boolean }) => {
  return (
    <SidebarFrame
      footer={walletReady ? <LogoutButton sx={{ marginBottom: 12, width: '85%' }} /> : undefined}
    >
      {walletReady ? <SidebarReadyContent /> : <UserProfileLoading />}
      {!walletReady && <MenuList />}
    </SidebarFrame>
  )
}

export default Sidebar
