import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import { cn } from '@nl/ui/utils'
import type { JSX } from 'solid-js'

interface ItemProps {
  label?: string
  value?: string | number
  isDisable?: boolean
  isLoading?: boolean
}

const Item = ({ label, value, isDisable = false, isLoading = true }: ItemProps): JSX.Element => (
  <div class="flex flex-row justify-between">
    <span class={cn('text-base', isDisable ? 'text-muted-foreground' : 'text-foreground')}>
      {label}:
    </span>
    {isLoading ? (
      <DeferredSkeleton class="h-(--skel-h) w-3/20 rounded" style={{ '--skel-h': '18.67px' }} />
    ) : (
      <span class={cn('text-base font-bold', isDisable ? 'text-muted-foreground' : 'text-warning')}>
        {value}
      </span>
    )}
  </div>
)

export default Item
