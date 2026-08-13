import dynamic from 'next/dynamic'

import useAuth from '@/hooks/useAuth'
import MenuList from './_MenuList'
import SidebarFrame from './SidebarFrame'

const UserProfile = dynamic(() => import('./_UserProfile'), {
  ssr: false,
  loading: () => <div className="mb-4 h-44 animate-pulse rounded-lg bg-muted" aria-hidden="true" />,
})

const LogoutButton = dynamic(() => import('./_LogoutButton'), { ssr: false })

// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = () => {
  const { isLoggedIn } = useAuth()

  return (
    <SidebarFrame footer={<LogoutButton sx={{ marginBottom: 12, width: '85%' }} />}>
      <UserProfile />
      <MenuList isLoggedIn={isLoggedIn} />
    </SidebarFrame>
  )
}

export default Sidebar
