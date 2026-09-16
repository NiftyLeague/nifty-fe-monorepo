import { DeferredSection } from '@nl/ui/custom/deferred-section'

const loadCareersJobs = () => import('@/components/CareersJobs')

export function DeferredCareersJobs() {
  return (
    <DeferredSection
      label="job openings"
      load={loadCareersJobs}
      minHeightClassName="min-h-120"
      rootMargin="480px"
    />
  )
}
