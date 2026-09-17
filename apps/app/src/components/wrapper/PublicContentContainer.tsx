import { cx } from '@nl/ui/class-names'
import type { JSX } from 'solid-js'

interface PublicContentContainerProps {
  children?: JSX.Element
  /**
   * Fill the main area's height with a flex column instead of growing with
   * the content. Embed screens (game, world map, mint) use this so the
   * iframe shell consumes all remaining vertical space at any viewport.
   */
  fill?: boolean
}

/*
 * The single padded shell for public route content. Game, world and mint embed
 * screens all render the shared NiftyWorldEmbed inside this container; there is
 * deliberately no flush variant, so those screens cannot drift apart again.
 */
export default function PublicContentContainer(props: PublicContentContainerProps) {
  return (
    <div class={cx('container py-5 md:py-10', props.fill && 'flex h-full min-h-0 flex-col')}>
      {props.children}
    </div>
  )
}
