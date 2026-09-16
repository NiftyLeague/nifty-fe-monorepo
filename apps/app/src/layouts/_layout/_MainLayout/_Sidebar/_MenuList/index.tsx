// project imports
import NavGroup from './_NavGroup'
import { PublicItems, PrivateItems } from '@/constants/menu-items'

// ==============================|| SIDEBAR MENU LIST ||============================== //

const PUBLIC_NAV_ITEMS = PublicItems.items
const AUTHENTICATED_NAV_ITEMS = [...PublicItems.items, ...PrivateItems.items]

const MenuList = (props: { isLoggedIn?: boolean }) => {
  return (
    <>
      {(props.isLoggedIn ? AUTHENTICATED_NAV_ITEMS : PUBLIC_NAV_ITEMS).map((item) => {
        switch (item.type) {
          case 'group':
            return <NavGroup item={item} />
          default:
            return <h6 class="text-center text-error">Menu Items Error</h6>
        }
      })}
    </>
  )
}

export default MenuList
