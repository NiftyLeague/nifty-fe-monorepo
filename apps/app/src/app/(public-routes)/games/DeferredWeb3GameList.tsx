'use client'

import DeferredSection from '@nl/ui/custom/deferred-section'

const loadWeb3GameList = () => import('./_Web3GameList')

export default function Web3GameList() {
  return (
    <DeferredSection
      label="Web3 games"
      load={loadWeb3GameList}
      minHeightClassName="min-h-24"
      rootMargin="200px"
    />
  )
}
