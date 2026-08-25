import { ExternalLink } from 'lucide-react'
import type { ComponentProps } from 'react'

import { cx } from '@nl/ui/class-names'

export function ExternalIcon({
  className = '',
  ...props
}: Omit<ComponentProps<typeof ExternalLink>, 'size'>) {
  return (
    <ExternalLink
      {...props}
      width={14}
      height={14}
      size={14}
      className={cx('ml-1 mb-1.5 inline-block shrink-0 cursor-pointer', className)}
      aria-hidden="true"
    />
  )
}

export default ExternalIcon
