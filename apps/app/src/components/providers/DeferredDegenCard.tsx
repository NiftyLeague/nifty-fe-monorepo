'use client'

import { useRef } from 'react'

import DeferredComponent from '@nl/ui/custom/deferred-component'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'

import SkeletonDegenPlaceholder from '@/components/cards/Skeleton/DegenPlaceholder'
import type { DegenCardProps } from '@/components/cards/DegenCard'

// Keep card code close enough to the viewport to avoid visible skeletons while
// avoiding the extra route work caused by the previous 320px preload window.
export const DEFERRED_DEGEN_CARD_ROOT_MARGIN = '160px'

const loadDegenCard = () => import('@/components/cards/DegenCard')

export default function DeferredDegenCard({ size = 'normal', ...props }: DegenCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isNearViewport = useOnScreen(cardRef, DEFERRED_DEGEN_CARD_ROOT_MARGIN, { once: true })

  return (
    <div ref={cardRef}>
      <DeferredComponent
        disabledFallback={<SkeletonDegenPlaceholder size={size} />}
        enabled={isNearViewport}
        label="DEGEN card"
        load={loadDegenCard}
        loadingFallback={<SkeletonDegenPlaceholder size={size} />}
        props={{ size, ...props }}
      />
    </div>
  )
}
