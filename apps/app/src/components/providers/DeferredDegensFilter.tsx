'use client'

import { useEffect, useState, type ComponentType } from 'react'

import { Button } from '@nl/ui/base/button'

import type { DegenFilter } from '@/types/degenFilter'
import DeferredDialogLoading from './DeferredDialogLoading'

interface DegensFilterProps {
  onFilter: (filter: DegenFilter) => void
  defaultFilterValues: DegenFilter
  searchTerm?: string
}

type DegensFilterComponent = ComponentType<DegensFilterProps>

const loadDegensFilter = () => import('@/components/extended/DegensFilter')

export default function DeferredDegensFilter(props: DegensFilterProps) {
  const [Filter, setFilter] = useState<DegensFilterComponent | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (Filter) return

    let active = true
    setLoadError(false)

    loadDegensFilter()
      .then(({ default: nextFilter }) => {
        if (active) setFilter(() => nextFilter)
      })
      .catch(() => {
        if (active) setLoadError(true)
      })

    return () => {
      active = false
    }
  }, [Filter, retryCount])

  if (loadError) {
    return (
      <div className="flex min-h-24 flex-col items-center justify-center gap-2" role="alert">
        <span>DEGEN filters could not be loaded.</span>
        <Button type="button" variant="link" onClick={() => setRetryCount((count) => count + 1)}>
          Retry
        </Button>
      </div>
    )
  }

  if (!Filter) return <DeferredDialogLoading label="Loading degen filters" />

  return <Filter {...props} />
}
