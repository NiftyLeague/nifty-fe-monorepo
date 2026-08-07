import { Ref, forwardRef } from 'react'

import { Card, CardContent, CardHeader } from '@nl/ui/base/card'
import { Separator } from '@nl/ui/base/separator'
import { Title } from '@nl/ui/custom/typography'
import { cn } from '@nl/ui/utils'

// ==============================|| CUSTOM MAIN CARD ||============================== //

export interface MainCardProps {
  border?: boolean
  boxShadow?: boolean
  children: React.ReactNode | string
  content?: boolean
  contentClass?: string
  darkTitle?: boolean
  sx?: React.CSSProperties
  title?: React.ReactNode | string
  secondary?: React.ReactNode
  shadow?: string
  className?: string
  style?: React.CSSProperties
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
        className={cn(
          'h-full',
          border && 'border',
          boxShadow &&
            (shadow ||
              'shadow-[0_2px_14px_0_rgb(33_150_243/0.1)] dark:shadow-[0_2px_14px_0_rgb(32_40_45/0.08)]'),
          className
        )}
        {...(others as React.ComponentProps<'div'>)}
      >
        {/* card header and action */}
        {title && (
          <>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <Title level={darkTitle ? 3 : 5}>{title}</Title>
              {secondary}
            </CardHeader>
            <Separator className="opacity-60" />
          </>
        )}

        {/* card content */}
        {content && (
          <CardContent className={cn('px-6', contentClass || '')}>{children}</CardContent>
        )}
        {!content && children}
      </Card>
    )
  }
)

MainCard.displayName = 'MainCard'
export default MainCard
