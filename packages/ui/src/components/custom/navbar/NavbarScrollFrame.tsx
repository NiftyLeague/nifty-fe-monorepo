import type { ReactNode } from 'react'

import { cx } from '@nl/ui/class-names'

import NavbarScrollState from './NavbarScrollState'

interface NavbarScrollFrameProps {
  children: ReactNode
  className?: string
}

export const NAVBAR_SCROLL_FRAME_ID = 'nifty-navbar-scroll-frame'

export function NavbarScrollFrame({ children, className }: NavbarScrollFrameProps) {
  return (
    <header
      id={NAVBAR_SCROLL_FRAME_ID}
      className={cx(
        'navbar-scroll-frame fixed inset-x-0 top-0 z-50 h-20 bg-transparent data-[scrolled=true]:backdrop-blur-xs',
        className
      )}
      data-scrolled="false"
    >
      {children}
      <NavbarScrollState targetId={NAVBAR_SCROLL_FRAME_ID} />
    </header>
  )
}

export default NavbarScrollFrame
