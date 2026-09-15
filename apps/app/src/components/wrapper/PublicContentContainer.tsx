import type { JSX } from 'solid-js'

interface PublicContentContainerProps {
  children?: JSX.Element
  flush?: boolean
}

export default function PublicContentContainer(props: PublicContentContainerProps) {
  return (
    <div
      class={props.flush ? 'h-full min-h-full w-full max-w-none p-0' : 'container py-5 md:py-10'}
    >
      {props.children}
    </div>
  )
}
