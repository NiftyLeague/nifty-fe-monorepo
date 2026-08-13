'use client'

import { useRef } from 'react'

import { Button } from '@nl/ui/base/button'
import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'

import SkeletonDegenPlaceholder from '@/components/cards/Skeleton/DegenPlaceholder'
import type { DegenCardProps } from '@/components/cards/DegenCard'

const loadDegenCard = () => import('@/components/cards/DegenCard')

export default function DeferredDegenCard({ size = 'normal', ...props }: DegenCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isNearViewport = useOnScreen(cardRef, '320px')
  const {
    Component: DegenCard,
    hasError: loadError,
    retry,
  } = useDeferredComponent<DegenCardProps>(loadDegenCard, isNearViewport)

  return (
    <div ref={cardRef} aria-busy={!DegenCard && !loadError}>
      {loadError ? (
        <div className="flex min-h-48 flex-col items-center justify-center gap-3" role="alert">
          <span>DEGEN card could not be loaded.</span>
          <Button type="button" variant="outline" onClick={retry}>
            Retry
          </Button>
        </div>
      ) : DegenCard ? (
        <DegenCard size={size} {...props} />
      ) : (
        <SkeletonDegenPlaceholder size={size} />
      )}
    </div>
  )
}
