import { ExternalLink } from 'lucide-react'

import type { IconProps } from '@nl/ui/base/icon'
import { cn } from '@nl/ui/utils'

export function ExternalIcon({ className = '', size = 'xs', ...props }: Omit<IconProps, 'name'>) {
  const iconSize = typeof size === 'number' ? size : size === 'xs' ? 14 : size === 'sm' ? 18 : 20

  return (
    <ExternalLink
      size={iconSize}
      className={cn('ml-1 mb-1.5 inline-block size-3 flex-shrink-0 cursor-pointer', className)}
      aria-hidden="true"
      {...props}
    />
  )
}

export default ExternalIcon
