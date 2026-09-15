import { splitProps, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import { cn } from '@nl/ui/utils'

interface TitleProps {
  class?: string
  className?: string
  children?: JSX.Element
  level: 1 | 2 | 3 | 4 | 5 | 6
  style?: JSX.CSSProperties | string
}

export function Title(props: TitleProps) {
  const [local] = splitProps(props, ['class', 'className', 'children', 'level', 'style'])

  const levelClasses = {
    1: 'text-4xl font-bold font-header tracking-header',
    2: 'text-3xl font-bold font-header tracking-header',
    3: 'text-2xl font-bold font-header tracking-header',
    4: 'text-xl font-normal font-subheader tracking-subheader',
    5: 'text-lg font-normal font-subheader tracking-subheader',
    6: 'text-base font-normal font-subheader tracking-subheader',
  }

  return (
    <Dynamic
      component={`h${local.level}`}
      class={cn(levelClasses[local.level], local.class, local.className)}
      style={local.style}
    >
      {local.children}
    </Dynamic>
  )
}

export default Title
