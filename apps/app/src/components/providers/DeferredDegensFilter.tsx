'use client'

import DeferredComponent from '@nl/ui/custom/deferred-component'

import type { DegenFilter } from '@/types/degenFilter'
import DeferredDialogLoading from './DeferredDialogLoading'

interface DegensFilterProps {
  onFilter?: (filter: DegenFilter) => void
  defaultFilterValues: DegenFilter
  searchTerm?: string
}

const loadDegensFilter = () => import('@/components/extended/DegensFilter')

export default function DeferredDegensFilter(props: DegensFilterProps) {
  return (
    <DeferredComponent
      label="DEGEN filters"
      load={loadDegensFilter}
      loadingFallback={<DeferredDialogLoading label="Loading degen filters" />}
      props={props}
    />
  )
}
