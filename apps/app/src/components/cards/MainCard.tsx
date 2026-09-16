import { type ComponentProps, Show, splitProps, type JSX } from 'solid-js'

import { Card, CardContent, CardHeader } from '@nl/ui/base/card'
import { Separator } from '@nl/ui/base/separator'
import { Title } from '@nl/ui/custom/typography'
import { cn } from '@nl/ui/utils'

// ==============================|| CUSTOM MAIN CARD ||============================== //

interface MainCardProps {
  ref?: HTMLDivElement | ((el: HTMLDivElement) => void)
  border?: boolean
  boxShadow?: boolean
  children: JSX.Element | string
  content?: boolean
  contentClass?: string
  darkTitle?: boolean
  title?: JSX.Element | string
  secondary?: JSX.Element
  shadow?: string
  className?: string
}

const MainCard = (props: MainCardProps) => {
  const [local, others] = splitProps(props, [
    'ref',
    'border',
    'boxShadow',
    'children',
    'content',
    'contentClass',
    'darkTitle',
    'secondary',
    'shadow',
    'title',
    'className',
  ])
  const border = () => local.border ?? true
  const content = () => local.content ?? true

  return (
    <Card
      ref={local.ref}
      class={cn(
        'h-full gap-0 py-0',
        border() && 'border',
        local.boxShadow &&
          (local.shadow || 'shadow-(--card-shadow-blue) dark:shadow-(--card-shadow-dark)'),
        local.className
      )}
      {...(others as ComponentProps<'div'>)}
    >
      {/* card header and action */}
      <Show when={local.title}>
        <CardHeader class="flex flex-row items-center justify-between gap-2 p-4">
          <Title level={local.darkTitle ? 3 : 5}>{local.title}</Title>
          {local.secondary}
        </CardHeader>
        <Separator class="opacity-60" />
      </Show>

      {/* card content */}
      <Show when={content()} fallback={local.children}>
        <CardContent class={cn('p-4', local.contentClass || '')}>{local.children}</CardContent>
      </Show>
    </Card>
  )
}

export default MainCard
