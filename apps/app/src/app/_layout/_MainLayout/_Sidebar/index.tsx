import useAuth from '@/hooks/useAuth'
import MenuList from './_MenuList'
import UserProfile from './_UserProfile'
import LogoutButton from './_LogoutButton'
import SidebarFrame from './SidebarFrame'

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
