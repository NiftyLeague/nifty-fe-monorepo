import type { AnchorHTMLAttributes, PropsWithChildren } from 'react'

type LinkProps = PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }>

export default function DocusaurusLink({ children, to, ...props }: LinkProps) {
  return (
    <a href={to} {...props}>
      {children}
    </a>
  )
}
