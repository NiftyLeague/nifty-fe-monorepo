import type { MouseEventHandler, ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { IconButton } from '@nl/ui/base/icon-button'
import { cn } from '@nl/ui/utils'

interface PaginationControlsProps {
  hasNext: boolean
  hasPrev: boolean
  onClickNext: MouseEventHandler<HTMLButtonElement>
  onClickPrev: MouseEventHandler<HTMLButtonElement>
  pageLabel?: ReactNode
  className?: string
  buttonClassName?: string
  iconSize?: number
}

export function PaginationControls({
  hasNext,
  hasPrev,
  onClickNext,
  onClickPrev,
  pageLabel,
  className,
  buttonClassName,
  iconSize = 18,
}: PaginationControlsProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <IconButton
        aria-label="Previous page"
        className={cn('cursor-pointer', buttonClassName)}
        disabled={!hasPrev}
        onClick={onClickPrev}
      >
        <ChevronLeft aria-hidden="true" absoluteStrokeWidth size={iconSize} strokeWidth={1.5} />
      </IconButton>
      {pageLabel}
      <IconButton
        aria-label="Next page"
        className={cn('cursor-pointer', buttonClassName)}
        disabled={!hasNext}
        onClick={onClickNext}
      >
        <ChevronRight aria-hidden="true" absoluteStrokeWidth size={iconSize} strokeWidth={1.5} />
      </IconButton>
    </div>
  )
}
