import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import { Title } from '@nl/ui/custom/typography'

const TopInfoSkeleton = () => {
  return (
    <div class="flex flex-col">
      <div class="flex flex-row items-center gap-10">
        <div class="w-1/2">
          <DeferredSkeleton class="my-1.25 h-6.5 w-1/2 rounded" />
        </div>
        <div class="w-1/2">
          <DeferredSkeleton class="h-6.25 w-full rounded" />
        </div>
      </div>
      <div class="flex flex-row items-center gap-10">
        <Title level={4} class="w-1/2">
          <DeferredSkeleton class="my-1.25 h-6.5 w-3/10 rounded" />
        </Title>
        <Title level={4} class="w-1/2">
          <DeferredSkeleton
            class="inline-block h-(--skel-h) w-3/20 rounded"
            style={{ '--skel-h': '19.76px' }}
          />
        </Title>
      </div>
    </div>
  )
}

export default TopInfoSkeleton
