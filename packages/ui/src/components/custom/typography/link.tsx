import { splitProps, type JSX } from 'solid-js'

import { cn } from '@nl/ui/utils'

interface LinkProps {
  class?: string
  className?: string
  children?: JSX.Element
  disabled?: boolean
  href: string
  onClick?: (event: MouseEvent & { currentTarget: HTMLAnchorElement }) => void
  style?: JSX.CSSProperties | string
  target?: '_blank' | '_self' | '_parent' | '_top' | 'framename'
}

export function Link(props: LinkProps) {
  const [local] = splitProps(props, [
    'children',
    'class',
    'className',
    'disabled',
    'href',
    'onClick',
    'style',
    'target',
  ])
  const classes = cn(
    'cursor-pointer text-base text-blue no-underline hover:underline',
    { 'text-muted-foreground cursor-not-allowed': local.disabled },
    local.class,
    local.className
  )

  const handleClick = (event: MouseEvent & { currentTarget: HTMLAnchorElement }) => {
    if (local.disabled) {
      event.preventDefault()
      return
    }
    local.onClick?.(event)
  }

  return (
    <a
      onClick={handleClick}
      class={classes}
      href={!local.disabled ? local.href : undefined}
      target={local.target}
      rel="noopener noreferrer"
      style={local.style}
    >
      {local.children}
    </a>
  )
}

export default Link
