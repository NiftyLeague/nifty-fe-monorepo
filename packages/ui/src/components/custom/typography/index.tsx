import { splitProps, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import { cn } from '@nl/ui/utils'

import { Link } from './link'
import { Text } from './text'
import { Title } from './title'

interface TypographyProps {
  children?: JSX.Element
  class?: string
  className?: string
  style?: JSX.CSSProperties | string
  tag?: string
  [key: string]: unknown
}

function Typography(props: TypographyProps) {
  const [local, others] = splitProps(props, ['children', 'class', 'className', 'tag'])
  const classes = cn(
    'text-foreground text-base font-default font-normal tracking-default',
    local.class,
    local.className
  )

  return (
    <Dynamic component={local.tag || 'div'} class={classes} {...others}>
      {local.children}
    </Dynamic>
  )
}

Typography.Link = Link
Typography.Text = Text
Typography.Title = Title

export { Typography, Link, Text, Title }

export default Typography
