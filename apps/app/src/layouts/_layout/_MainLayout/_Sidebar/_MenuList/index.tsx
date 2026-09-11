import { memo } from 'react'

// project imports
import NavGroup from './_NavGroup'
import { PublicItems, PrivateItems } from '@/constants/menu-items'

// ==============================|| SIDEBAR MENU LIST ||============================== //

const PUBLIC_NAV_ITEMS = PublicItems.items
const AUTHENTICATED_NAV_ITEMS = [...PublicItems.items, ...PrivateItems.items]

const MenuList = ({ isLoggedIn = false }: { isLoggedIn?: boolean }) => {
  const lastItems = isLoggedIn ? AUTHENTICATED_NAV_ITEMS : PUBLIC_NAV_ITEMS

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
