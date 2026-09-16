import { CardContent } from '@nl/ui/base/card'
import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import MainCard from '../MainCard'

interface DegenPlaceholderProps {
  size?: 'normal' | 'small'
}

const DegenPlaceholder = ({ size = 'normal' }: DegenPlaceholderProps) => (
  <MainCard content={false} boxShadow={false} border={false}>
    <DeferredSkeleton class={size === 'small' ? 'h-50' : 'h-80'} />
    <CardContent class="px-4 pt-1 pb-0">
      <div class="mb-1 flex flex-row justify-between gap-2">
        <DeferredSkeleton class="h-8 w-25" />
        <DeferredSkeleton class="h-8 w-25" />
        <DeferredSkeleton class="h-8 w-25" />
      </div>
      <div class="mb-2.5 flex flex-row">
        <DeferredSkeleton class="h-5 w-full" />
      </div>
      <div class="flex flex-row justify-between gap-2">
        <DeferredSkeleton class="h-5.25 w-full" />
        <DeferredSkeleton class="h-5.25 w-full" />
      </div>
    </CardContent>
    <div class="flex items-center gap-2 px-4 py-2">
      <DeferredSkeleton class="h-(--skel-h) w-full" style={{ '--skel-h': '36.5px' }} />
      <DeferredSkeleton class="h-(--skel-h) w-full" style={{ '--skel-h': '36.5px' }} />
    </div>
  </MainCard>
)

export default DegenPlaceholder
