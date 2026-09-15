import type { JSX } from 'solid-js'

import { cx } from '@nl/ui/class-names'

import NavbarScrollState from './NavbarScrollState'

interface NavbarScrollFrameProps {
  children: JSX.Element
  className?: string
}

const NAVBAR_SCROLL_FRAME_ID = 'nifty-navbar-scroll-frame'

export function NavbarScrollFrame(props: NavbarScrollFrameProps) {
  return (
    <header
      id={NAVBAR_SCROLL_FRAME_ID}
      class={cx(
        'navbar-scroll-frame fixed inset-x-0 top-0 z-50 h-20 bg-transparent md:data-[scrolled=true]:backdrop-blur-xs',
        props.className
      )}
      data-scrolled="false"
    >
      {props.children}
      <NavbarScrollState targetId={NAVBAR_SCROLL_FRAME_ID} />
    </header>
  )
}
