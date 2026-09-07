'use client'

import DeferredSection from '@nl/ui/custom/deferred-section'

const loadWeb3GameGrid = async () => {
  const { default: Web3GameList } = await import('./_Web3GameList')

  return {
    default: function Web3GameGrid() {
      return (
        <div className="grid grid-cols-12 gap-y-8 pb-8 sm:gap-y-0 sm:pb-4 md:pb-0">
          <Web3GameList />
        </div>
      )
    },
  }
}

export default function DeferredWeb3GameList() {
  return <DeferredSection label="Web3 game cards" load={loadWeb3GameGrid} />
}
