import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AppNavIcon } from '@/components/AppNavIcon'

import { cn } from '@nl/ui/utils'
import { useNavigation } from '@/contexts/NavigationContext'

// types
import type { LinkTarget, NavItemType } from '@/types'

interface NavItemProps {
  item: NavItemType
  level: number
}

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavItem = ({ item, level }: NavItemProps) => {
  const pathname = usePathname()
  const { isDesktopNavigation, setDrawerOpen } = useNavigation()
  const isSelected = pathname === item.url

  let itemTarget: LinkTarget = '_self'
  if (item.target) {
    itemTarget = '_blank'
  }

  const itemHandler = () => {
    if (!isDesktopNavigation) setDrawerOpen(false)
  }

  const inner = (
    <>
      <span className="my-auto" style={{ minWidth: !item?.icon ? 18 : 36 }}>
        <AppNavIcon name={item?.icon ?? 'dot'} size="lg" />
      </span>
      <span className="flex-1">
        <span
          className={cn('text-base', isSelected ? 'font-bold' : 'font-normal')}
          style={{ color: 'inherit' }}
        >
          {item.title}
        </span>
        {item.caption && (
          <span className="block text-xs font-medium uppercase text-muted-foreground">
            {item.caption}
          </span>
        )}
      </span>
    </>
  )

  const linkClass = cn(
    'mb-0.5 flex items-start gap-2 rounded-md border border-transparent bg-transparent px-2 py-2 text-left transition-colors hover:border-purple hover:bg-muted',
    isSelected && 'border-purple bg-muted'
  )
  const style = {
    paddingLeft: `${level * 24}px`,
    paddingTop: level > 1 ? 8 : 10,
    paddingBottom: level > 1 ? 8 : 10,
  }

  if (item?.external) {
    return (
      <a
        href={item.url}
        target={itemTarget}
        rel="noopener noreferrer"
        className={linkClass}
        style={style}
        onClick={itemHandler}
      >
        {inner}
      </a>
    )
  }

  return (
    <Link
      href={item.url!}
      target={itemTarget}
      className={linkClass}
      style={style}
      onClick={itemHandler}
    >
      {inner}
    </Link>
  )
}

export default NavItem
