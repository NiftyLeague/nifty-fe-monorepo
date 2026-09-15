import {  } from 'solid-js'

import { Card, CardContent, CardHeader } from '@nl/ui/base/card'
import { Separator } from '@nl/ui/base/separator'
import { Title } from '@nl/ui/custom/typography'
import { cn } from '@nl/ui/utils'

// ==============================|| CUSTOM MAIN CARD ||============================== //

interface MainCardProps {
  border?: boolean
  boxShadow?: boolean
  children: JSX.Element | string
  content?: boolean
  contentClass?: string
  darkTitle?: boolean
  sx?: JSX.CSSProperties
  title?: JSX.Element | string
  secondary?: JSX.Element
  shadow?: string
  className?: string
  style?: JSX.CSSProperties
}

const MainCard = forwardRef<HTMLDivElement, MainCardProps>(
  (
    {
      border = true,
      boxShadow,
      children,
      content = true,
      contentClass = '',
      darkTitle,
      secondary,
      shadow,
      sx,
      title,
      className,
      ...others
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        style={sx}
        class={cn(
          'h-full gap-0 py-0',
          border && 'border',
          boxShadow &&
            (shadow ||
              'shadow-[0_2px_14px_0_rgb(33_150_243/0.1)] dark:shadow-[0_2px_14px_0_rgb(32_40_45/0.08)]'),
          className
        )}
        {...(others as JSX.ComponentProps<'div'>)}
      >
        {/* card header and action */}
        {title && (
          <>
            <CardHeader class="flex flex-row items-center justify-between gap-2 p-4">
              <Title level={darkTitle ? 3 : 5}>{title}</Title>
              {secondary}
            </CardHeader>
            <Separator class="opacity-60" />
          </>
        )}

        {/* card content */}
        {content && <CardContent class={cn('p-4', contentClass || '')}>{children}</CardContent>}
        {!content && children}
      </Card>
    )
  }
)

MainCard.displayName = 'MainCard'
export default MainCard
