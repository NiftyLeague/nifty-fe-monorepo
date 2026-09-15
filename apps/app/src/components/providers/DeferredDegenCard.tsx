'use client'

import { type JSX } from 'solid-js'

import DeferredComponent from '@nl/ui/custom/deferred-component'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'

import SkeletonDegenPlaceholder from '@/components/cards/Skeleton/DegenPlaceholder'
import type { DegenCardProps } from '@/components/cards/DegenCard'
import type { PublicDegen } from '@/types/degens'

// Keep card code close enough to the viewport to avoid visible skeletons while
// avoiding the extra route work caused by the previous 320px preload window.
export const DEFERRED_DEGEN_CARD_ROOT_MARGIN = '160px'

// The module import instantiates the card at its constraint, so the deferred
// boundary is pinned to `DegenCardProps<PublicDegen>`; the degen flows through
// unchanged at runtime.
const loadDegenCard = () => import('@/components/cards/DegenCard')

function DeferredDegenCardInner<T extends PublicDegen>({
  size = 'normal',
  ...props
}: DegenCardProps<T>) {
  let cardRef: HTMLDivElement | undefined
  const isNearViewport = useOnScreen(() => cardRef, DEFERRED_DEGEN_CARD_ROOT_MARGIN, {
    once: true,
  })

  return (
    <div ref={(el) => (cardRef = el)}>
      <DeferredComponent
        disabledFallback={<SkeletonDegenPlaceholder size={size} />}
        enabled={isNearViewport()}
        label="DEGEN card"
        load={loadDegenCard}
        loadingFallback={<SkeletonDegenPlaceholder size={size} />}
        props={{ size, ...props } as DegenCardProps<PublicDegen>}
      />
    </div>
  )
}

// Memoized so a stable degen reference and stable callbacks skip the whole
// deferral machinery when the page re-renders around an unchanged grid.
const DeferredDegenCard = DeferredDegenCardInner as <T extends PublicDegen>(
  props: DegenCardProps<T> & { children?: JSX.Element }
) => JSX.Element

export default DeferredDegenCard
