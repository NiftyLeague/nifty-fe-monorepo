import { ReactNode } from 'react'
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
    title?: ReactNode | string
    caption?: ReactNode | string
    color?: 'primary' | 'secondary' | 'default' | undefined
    url?: string
  }
}

const NavGroup = ({ item }: NavGroupProps) => {
  // menu list collapse & items
  const items = (item?.children || []).map((menu) => {
    switch (menu.type) {
      case 'collapse':
        return <NavCollapse key={menu.id} menu={menu} level={1} />
      case 'item':
        return <NavItem key={menu.id} item={menu} level={1} />
      default:
        return (
          <h6 key={menu.id} className="text-center text-error">
            Menu Items Error
          </h6>
        )
    }
  })

  return (
    <>
      <div>
        {item.title && (
          <div className="mt-2.5 p-1.5 text-sm font-medium capitalize text-muted-foreground">
            {item.title}
            {item.caption && (
              <span className="block text-xs font-medium capitalize text-muted-foreground">
                {item.caption}
              </span>
            )}
          </div>
        )}
        {items}
      </div>
      {/* group divider */}
      <Separator className="mt-1 mb-5 opacity-60" />
    </>
  )
}

export default NavGroup
