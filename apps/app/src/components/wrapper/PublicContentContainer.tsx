import type { PropsWithChildren } from 'react'

export default function PublicContentContainer({ children }: PropsWithChildren) {
  return <div className="container py-5 md:py-10">{children}</div>
}
