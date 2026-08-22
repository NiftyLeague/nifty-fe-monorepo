import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import { Title } from '@nl/ui/custom/typography'
import type { GenericCardProps } from '@/types'
// project imports
import MainCard from './MainCard'

// ============================|| HOVER DATA CARD ||============================ //

interface HoverDataCardProps extends Omit<GenericCardProps, 'title'> {
  customStyle?: React.CSSProperties
  actions?: React.ReactNode
  isLoading?: boolean
  title?: string | React.ReactNode
}

const HoverDataCard = ({
  title,
  primary,
  secondary,
  customStyle,
  actions,
  isLoading,
}: HoverDataCardProps) => (
  <MainCard sx={customStyle ?? {}}>
    <div className="flex flex-col items-center justify-between">
      <div className="w-full">
        {isLoading ? (
          <DeferredSkeleton className="h-5 w-20" />
        ) : (
          <Title level={4} className="text-center">
            {title}
          </Title>
        )}
      </div>
      <div className="w-full">
        <div className="mt-1.75 mb-0.5 flex flex-row justify-center gap-1">
          {isLoading ? (
            <DeferredSkeleton className="h-5 w-20" />
          ) : (
            <span className="text-base font-bold">{primary}</span>
          )}
        </div>
      </div>
      {secondary && (
        <div className="mb-1.75 w-full">
          <div className="flex flex-row justify-center gap-1">
            {isLoading ? (
              <DeferredSkeleton className="h-5 w-30" />
            ) : (
              <span className="text-sm text-muted-foreground">{secondary}</span>
            )}
          </div>
        </div>
      )}
      {actions}
    </div>
  </MainCard>
)

export default HoverDataCard
