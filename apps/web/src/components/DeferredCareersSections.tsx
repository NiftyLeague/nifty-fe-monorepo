'use client'

import { DeferredSection } from '@nl/ui/custom/deferred-section'

const loadCareersJobs = () => import('@/components/CareersJobs')

export function DeferredCareersJobs() {
  return (
    <DeferredSection
      label="job openings"
      load={loadCareersJobs}
      minHeightClassName="min-h-[30rem]"
      rootMargin="480px"
    />
  )
}
