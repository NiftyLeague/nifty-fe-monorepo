import { splitProps, type JSX } from 'solid-js'

import { cn } from '@nl/ui/utils'

interface TextProps {
  blockquote?: boolean
  class?: string
  className?: string
  children?: JSX.Element
  code?: boolean
  disabled?: boolean
  keyboard?: boolean
  mark?: boolean
  sm?: boolean
  strikethrough?: boolean
  strong?: boolean
  style?: JSX.CSSProperties | string
  underline?: boolean
  variant?: 'default' | 'error' | 'muted' | 'primary' | 'secondary' | 'success' | 'warning'
  xs?: boolean
}

export function Text(props: TextProps) {
  const [local] = splitProps(props, [
    'blockquote',
    'class',
    'className',
    'children',
    'code',
    'disabled',
    'keyboard',
    'mark',
    'sm',
    'strikethrough',
    'strong',
    'style',
    'underline',
    'variant',
    'xs',
  ])
  const variantClasses = {
    default: 'text-foreground',
    error: 'text-error',
    muted: 'text-muted-foreground',
    primary: 'text-primary-foreground',
    secondary: 'text-secondary-foreground',
    success: 'text-success',
    warning: 'text-warning',
  }

  const classes = cn(
    'text-base font-default font-normal tracking-default',
    variantClasses[local.variant ?? 'default'],
    { 'text-muted-foreground cursor-not-allowed select-none': local.disabled },
    { underline: local.underline },
    { 'line-through': local.strikethrough },
    { 'text-sm leading-none': local.sm },
    { 'text-xs leading-none': local.xs }
  )
  const className = () => cn(classes, local.class, local.className)

  return (
    <>
      {local.blockquote ? (
        <blockquote class={cn(className(), 'mt-6 border-l-2 pl-6 italic')} style={local.style}>
          {local.children}
        </blockquote>
      ) : local.code ? (
        <code
          class={cn(
            className(),
            'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'
          )}
          style={local.style}
        >
          {local.children}
        </code>
      ) : local.mark ? (
        <mark class={cn(className(), 'p-0 bg-yellow-200')} style={local.style}>
          {local.children}
        </mark>
      ) : local.keyboard ? (
        <kbd
          class={cn(className(), 'px-1 py-0.5 bg-gray-100 border border-gray-300 rounded')}
          style={local.style}
        >
          {local.children}
        </kbd>
      ) : local.strong ? (
        <strong class={cn(className(), 'font-semibold')} style={local.style}>
          {local.children}
        </strong>
      ) : (
        <span class={className()} style={local.style}>
          {local.children}
        </span>
      )}
    </>
  )
}

export default Text
