import type { ComponentProps } from 'react'

import { cn } from '@nl/ui/utils'

export function ExternalIcon({ className = '', ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn('ml-1 mb-1.5 inline-block size-3 flex-shrink-0 cursor-pointer', className)}
      aria-hidden="true"
      {...props}
    >
      <span className="relative block size-full">
        <span className="absolute bottom-0 left-0 size-2 rounded-[1px] border border-current" />
        <span className="absolute top-0 right-0 size-2 border-t-2 border-r-2 border-current" />
        <span className="bg-current absolute top-[3px] right-0 h-0.5 w-2 origin-right -rotate-45" />
      </span>
    </span>
  )
}

export default ExternalIcon
