import { ReactNode, forwardRef, Ref } from 'react'

import { Card, CardContent, CardHeader } from '@nl/ui/base/card'
import { Separator } from '@nl/ui/base/separator'
import { Title } from '@nl/ui/custom/typography'
import { cn } from '@nl/ui/utils'

interface SubCardProps {
  children: ReactNode | string | null
  content?: boolean
  className?: string
  contentClass?: string
  darkTitle?: boolean
  secondary?: ReactNode | string
  sx?: {}
  contentSX?: {}
  title?: ReactNode | string
  style?: React.CSSProperties
}

// ==============================|| CUSTOM SUB CARD ||============================== //

const SubCard = forwardRef<HTMLDivElement, SubCardProps>(
  (
    {
      children,
      className,
      content = true,
      contentClass,
      darkTitle,
      secondary,
      sx = {},
      contentSX = {},
      title,
      ...others
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        style={sx as React.CSSProperties}
        className={cn('border gap-0 py-0', className)}
        {...(others as React.ComponentProps<'div'>)}
      >
        {/* card header and action */}
        {title && (
          <>
            <CardHeader className="flex flex-row items-center justify-between gap-2 p-2.5">
              <Title level={darkTitle ? 4 : 5}>{title}</Title>
              {secondary}
            </CardHeader>
            <Separator
              className="opacity-100"
              style={{ backgroundColor: 'var(--color-separator)' }}
            />
          </>
        )}

        {/* card content */}
        {content && (
          <CardContent
            style={contentSX as React.CSSProperties}
            className={cn('p-2.5', contentClass || '')}
          >
            {children}
          </CardContent>
        )}
        {!content && children}
      </Card>
    )
  }
)

SubCard.displayName = 'SubCard'

export default SubCard
