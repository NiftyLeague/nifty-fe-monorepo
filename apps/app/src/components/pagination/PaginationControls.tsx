import type { JSX } from 'solid-js'
import { ChevronLeft, ChevronRight } from 'lucide-solid'

import { IconButton } from '@nl/ui/base/icon-button'
import { cn } from '@nl/ui/utils'

interface PaginationControlsProps {
  hasNext: boolean
  hasPrev: boolean
  onClickNext: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
  onClickPrev: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
  pageLabel?: JSX.Element
  className?: string
  buttonClassName?: string
  iconSize?: number
  previousLabel?: string
  nextLabel?: string
}

export function PaginationControls(props: PaginationControlsProps) {
  return (
    <div class={cn('flex items-center gap-2', props.className)}>
      <IconButton
        aria-label={props.previousLabel ?? 'Previous page'}
        class={cn('cursor-pointer', props.buttonClassName)}
        disabled={!props.hasPrev}
        onClick={props.onClickPrev}
      >
        <ChevronLeft aria-hidden="true" size={props.iconSize ?? 18} stroke-width={1.5} />
      </IconButton>
      {props.pageLabel}
      <IconButton
        aria-label={props.nextLabel ?? 'Next page'}
        class={cn('cursor-pointer', props.buttonClassName)}
        disabled={!props.hasNext}
        onClick={props.onClickNext}
      >
        <ChevronRight aria-hidden="true" size={props.iconSize ?? 18} stroke-width={1.5} />
      </IconButton>
    </div>
  )
}
