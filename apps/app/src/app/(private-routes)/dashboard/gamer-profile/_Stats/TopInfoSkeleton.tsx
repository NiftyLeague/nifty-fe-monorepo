import { Skeleton } from '@nl/ui/base/skeleton'
import { Title } from '@nl/ui/custom/typography'

const TopInfoSkeleton = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center gap-10">
        <div className="w-1/2">
          <Skeleton className="my-[5px] h-[26px] w-1/2 rounded" />
        </div>
        <div className="w-1/2">
          <Skeleton className="h-[25px] w-full rounded" />
        </div>
      </div>
      <div className="flex flex-row items-center gap-10">
        <Title level={4} className="w-1/2">
          <Skeleton className="my-[5px] h-[26px] w-[30%] rounded" />
        </Title>
        <Title level={4} className="w-1/2">
          <Skeleton className="inline-block h-[19.76px] w-[15%] rounded" />
        </Title>
      </div>
    </div>
  )
}

export default TopInfoSkeleton
