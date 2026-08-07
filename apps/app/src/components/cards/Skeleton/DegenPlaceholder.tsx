import { CardContent } from '@nl/ui/base/card'
import { Skeleton } from '@nl/ui/base/skeleton'
import MainCard from '../MainCard'

interface DegenPlaceholderProps {
  size?: 'normal' | 'small'
}

const DegenPlaceholder = ({ size = 'normal' }: DegenPlaceholderProps) => (
  <MainCard content={false} boxShadow={false} border={false}>
    <Skeleton style={{ height: size === 'small' ? 200 : 320 }} />
    <CardContent className="px-4 pt-1 pb-0">
      <div className="mb-1 flex flex-row justify-between gap-2">
        <Skeleton className="h-8 w-25" />
        <Skeleton className="h-8 w-25" />
        <Skeleton className="h-8 w-25" />
      </div>
      <div className="mb-2.5 flex flex-row">
        <Skeleton className="h-5 w-full" />
      </div>
      <div className="flex flex-row justify-between gap-2">
        <Skeleton className="h-[21px] w-full" />
        <Skeleton className="h-[21px] w-full" />
      </div>
    </CardContent>
    <div className="flex items-center gap-2 px-4 py-2">
      <Skeleton className="h-[36.5px] w-full" />
      <Skeleton className="h-[36.5px] w-full" />
    </div>
  </MainCard>
)

export default DegenPlaceholder
