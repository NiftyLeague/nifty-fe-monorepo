import { memo } from 'react'

// project imports
import NavGroup from './_NavGroup'
import { PublicItems, PrivateItems } from '@/constants/menu-items'

// ==============================|| SIDEBAR MENU LIST ||============================== //

const getMenuItemsByLoginStatus = (loginStatus: boolean) => {
  if (loginStatus) {
    return { items: [...PublicItems.items, ...PrivateItems.items] }
  }

  return { items: [...PublicItems.items] }
}

const MenuList = ({ isLoggedIn = false }: { isLoggedIn?: boolean }) => {
  const lastItems = getMenuItemsByLoginStatus(isLoggedIn).items

  const navItems = lastItems.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />
      default:
        return (
          <h6 key={item.id} className="text-center text-error">
            Menu Items Error
          </h6>
        )
    }
  })

  return <>{navItems}</>
}

export default memo(MenuList)
