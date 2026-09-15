import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import { Title } from '@nl/ui/custom/typography'

const TopInfoSkeleton = () => {
  return (
    <div class="flex flex-col">
      <div class="flex flex-row items-center gap-10">
        <div class="w-1/2">
          <DeferredSkeleton class="my-[5px] h-[26px] w-1/2 rounded" />
        </div>
        <div class="w-1/2">
          <DeferredSkeleton class="h-[25px] w-full rounded" />
        </div>
      </div>
      <div class="flex flex-row items-center gap-10">
        <Title level={4} class="w-1/2">
          <DeferredSkeleton class="my-[5px] h-[26px] w-[30%] rounded" />
        </Title>
        <Title level={4} class="w-1/2">
          <DeferredSkeleton class="inline-block h-[19.76px] w-[15%] rounded" />
        </Title>
      </div>
    </div>
  )
}

export default TopInfoSkeleton
