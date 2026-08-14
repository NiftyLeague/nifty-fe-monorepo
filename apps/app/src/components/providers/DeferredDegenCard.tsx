'use client'

import { useRef } from 'react'

import DeferredComponent from '@nl/ui/custom/deferred-component'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'

import SkeletonDegenPlaceholder from '@/components/cards/Skeleton/DegenPlaceholder'
import type { DegenCardProps } from '@/components/cards/DegenCard'

const loadDegenCard = () => import('@/components/cards/DegenCard')

export default function DeferredDegenCard({ size = 'normal', ...props }: DegenCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isNearViewport = useOnScreen(cardRef, '320px')

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
