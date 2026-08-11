'use client'

import { useEffect, useRef, useState, type ComponentType } from 'react'

import { useOnScreen } from '@nl/ui/hooks/useOnScreen'

import SkeletonDegenPlaceholder from '@/components/cards/Skeleton/DegenPlaceholder'
import type { DegenCardProps } from '@/components/cards/DegenCard'

type DegenCardComponent = ComponentType<DegenCardProps>

const loadDegenCard = () => import('@/components/cards/DegenCard')

export default function DeferredDegenCard({ size = 'normal', ...props }: DegenCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isNearViewport = useOnScreen(cardRef, '320px')
  const [DegenCard, setDegenCard] = useState<DegenCardComponent | null>(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    if (!isNearViewport || DegenCard) return

    let active = true
    loadDegenCard()
      .then(({ default: nextDegenCard }) => {
        if (active) setDegenCard(() => nextDegenCard)
      })
      .catch(() => {
        if (active) setLoadError(true)
      })

    return () => {
      active = false
    }
  }, [DegenCard, isNearViewport])

  return (
    <div ref={cardRef} aria-busy={!DegenCard && !loadError}>
      {loadError ? (
        <div className="flex min-h-48 items-center justify-center" role="alert">
          <span>DEGEN card could not be loaded.</span>
        </div>
      ) : DegenCard ? (
        <DegenCard size={size} {...props} />
      ) : (
        <SkeletonDegenPlaceholder size={size} />
      )}
    </div>
  )
}
