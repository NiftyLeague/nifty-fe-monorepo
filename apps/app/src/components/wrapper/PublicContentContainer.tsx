import type { PropsWithChildren } from 'react'

interface PublicContentContainerProps extends PropsWithChildren {
  flush?: boolean
}

export default function PublicContentContainer({
  children,
  flush = false,
}: PublicContentContainerProps) {
  return (
    <div className={flush ? 'h-full min-h-full w-full max-w-none p-0' : 'container py-5 md:py-10'}>
      {children}
    </div>
  )
}
