'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AppNavIcon } from '@/components/AppNavIcon'

// project imports
import { cn } from '@nl/ui/utils'
import { NavGroupProps } from '../_NavGroup'
import NavItem from '../_NavItem'

// ==============================|| SIDEBAR MENU LIST COLLAPSE ITEMS ||============================== //

interface NavCollapseProps {
  menu: NavGroupProps['item']
  level: number
}

const NavCollapse = ({ menu, level }: NavCollapseProps) => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string | null | undefined>(null)

  const handleClick = () => {
    setOpen(!open)
    setSelected(!selected ? menu.id : null)
  }

  const pathname = usePathname()

  useEffect(() => {
    const children = menu?.children || []
    children.forEach((item: NavGroupProps['item']) => {
      if (pathname && pathname.includes('product-details')) {
        if (item.url && item.url.includes('product-details')) {
          setOpen(true)
        }
      }
      if (item.url === pathname) {
        setOpen(true)
      }
    })
  }, [pathname, menu?.children])

  // menu collapse & item
  const menus = (menu?.children || []).map((item) => {
    switch (item.type) {
      case 'collapse':
        return <NavCollapse key={item.id} menu={item} level={level + 1} />
      case 'item':
        return <NavItem key={item.id} item={item} level={level + 1} />
      default:
        return (
          <h6 key={item.id} className="text-center text-error">
            Menu Items Error
          </h6>
        )
    }
  })

  return (
    <>
      <button
        type="button"
        className={cn(
          'mb-0.5 flex w-full items-center rounded-md px-2 text-left',
          level > 1 ? 'py-2' : 'py-2.5',
          selected === menu.id ? 'bg-muted font-bold' : 'font-normal',
          level > 1 ? 'bg-transparent' : 'bg-inherit'
        )}
        style={{ paddingLeft: `${level * 24}px`, alignItems: 'center' }}
        onClick={handleClick}
      >
        <span className="my-auto" style={{ minWidth: !menu.icon ? 18 : 36 }}>
          <AppNavIcon name={menu?.icon ?? 'dot'} size="lg" className="ml-1" />
        </span>
        <span className="flex flex-1 flex-col">
          <span style={{ color: 'inherit' }}>{menu.title}</span>
          {menu.caption && (
            <span className="block text-xs font-medium uppercase text-muted-foreground">
              {menu.caption}
            </span>
          )}
        </span>
        <AppNavIcon
          name="chevron-down"
          size="md"
          className={cn('transition-transform', open && 'rotate-180 transform')}
        />
      </button>
      {open && (
        <div className="relative">
          <span
            aria-hidden
            className="absolute top-0 left-[27px] h-full w-px opacity-100"
            style={{ background: 'var(--color-separator)' }}
          />
          <div>{menus}</div>
        </div>
      )}
    </>
  )
}

export default NavCollapse
