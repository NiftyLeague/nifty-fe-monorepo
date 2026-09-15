import type { JSX } from 'solid-js'
import { Separator } from '@nl/ui/base/separator'

// project imports
import type { AppNavIconName } from '@/components/AppNavIcon'
import NavItem from '../_NavItem'
import NavCollapse from '../_NavCollapse'

// ==============================|| SIDEBAR MENU LIST GROUP ||============================== //

export interface NavGroupProps {
  item: {
    id?: string
    type?: string
    children?: NavGroupProps['item'][]
    icon?: AppNavIconName
    title?: JSX.Element | string
    caption?: JSX.Element | string
    color?: 'primary' | 'secondary' | 'default' | undefined
    url?: string
  }
}

const NavGroup = ({ item }: NavGroupProps) => {
  // menu list collapse & items
  const items = (item?.children || []).map((menu) => {
    switch (menu.type) {
      case 'collapse':
        return <NavCollapse menu={menu} level={1} />
      case 'item':
        return <NavItem item={menu} level={1} />
      default:
        return <h6 class="text-center text-error">Menu Items Error</h6>
    }
  })

  return (
    <>
      <div>
        {item.title && (
          <div class="mt-2.5 p-1.5 text-sm font-medium capitalize text-muted-foreground">
            {item.title}
            {item.caption && (
              <span class="block text-xs font-medium capitalize text-muted-foreground">
                {item.caption}
              </span>
            )}
          </div>
        )}
        {items}
      </div>
      {/* group divider */}
      <Separator class="mt-1 mb-5 opacity-60" />
    </>
  )
}

export default NavGroup
