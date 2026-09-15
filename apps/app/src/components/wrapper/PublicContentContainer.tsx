

interface PublicContentContainerProps { children?: JSX.Element
  flush?: boolean
}

export default function PublicContentContainer({
  children,
  flush = false,
}: PublicContentContainerProps) {
  return (
    <div class={flush ? 'h-full min-h-full w-full max-w-none p-0' : 'container py-5 md:py-10'}>
      {children}
    </div>
  )
}


interface PublicContentContainerProps { children?: JSX.Element
  flush?: boolean
}

export default function PublicContentContainer({
  children,
  flush = false,
}: PublicContentContainerProps) {
  return (
    <div class={flush ? 'h-full min-h-full w-full max-w-none p-0' : 'container py-5 md:py-10'}>
      {children}
    </div>
  )
}
