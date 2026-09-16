import type { JSX } from 'solid-js'

interface PublicContentContainerProps {
  children?: JSX.Element
}

/*
 * The single padded shell for public route content. Game, world and mint embed
 * screens all render the shared NiftyWorldEmbed inside this container; there is
 * deliberately no flush variant, so those screens cannot drift apart again.
 */
export default function PublicContentContainer(props: PublicContentContainerProps) {
  return <div class="container py-5 md:py-10">{props.children}</div>
}
