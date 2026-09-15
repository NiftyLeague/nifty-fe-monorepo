import { CardContent } from '@nl/ui/base/card'
import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import MainCard from '../MainCard'

interface DegenPlaceholderProps {
  size?: 'normal' | 'small'
}

const DegenPlaceholder = ({ size = 'normal' }: DegenPlaceholderProps) => (
  <MainCard content={false} boxShadow={false} border={false}>
    <DeferredSkeleton style={{ height: size === 'small' ? '200px' : '320px' }} />
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
        <DeferredSkeleton class="h-[21px] w-full" />
        <DeferredSkeleton class="h-[21px] w-full" />
      </div>
    </CardContent>
    <div class="flex items-center gap-2 px-4 py-2">
      <DeferredSkeleton class="h-[36.5px] w-full" />
      <DeferredSkeleton class="h-[36.5px] w-full" />
    </div>
  </MainCard>
)

export default DegenPlaceholder
