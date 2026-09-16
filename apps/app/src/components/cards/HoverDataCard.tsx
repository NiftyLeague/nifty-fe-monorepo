import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import { Title } from '@nl/ui/custom/typography'
import type { GenericCardProps } from '@/types'
// project imports
import MainCard from './MainCard'
import type { JSX } from 'solid-js'

// ============================|| HOVER DATA CARD ||============================ //

interface HoverDataCardProps extends Omit<GenericCardProps, 'title'> {
  actions?: JSX.Element
  isLoading?: boolean
  title?: string | JSX.Element
}

const HoverDataCard = (props: HoverDataCardProps) => (
  <MainCard className="relative">
    <div class="flex flex-col items-center justify-between">
      <div class="w-full">
        {props.isLoading ? (
          <DeferredSkeleton class="h-5 w-20" />
        ) : (
          <Title level={4} class="text-center">
            {props.title}
          </Title>
        )}
      </div>
      <div class="w-full">
        <div class="mt-1.75 mb-0.5 flex flex-row justify-center gap-1">
          {props.isLoading ? (
            <DeferredSkeleton class="h-5 w-20" />
          ) : (
            <span class="text-base font-bold">{props.primary}</span>
          )}
        </div>
      </div>
      {props.secondary && (
        <div class="mb-1.75 w-full">
          <div class="flex flex-row justify-center gap-1">
            {props.isLoading ? (
              <DeferredSkeleton class="h-5 w-30" />
            ) : (
              <span class="text-sm text-muted-foreground">{props.secondary}</span>
            )}
          </div>
        </div>
      )}
      {props.actions}
    </div>
  </MainCard>
)

export default HoverDataCard
