'use client'

import { createElement } from 'react'
import DeferredSection from '@nl/ui/custom/deferred-section'

const createWeb3GameGrid = (Web3GameList: React.ComponentType) =>
  function Web3GameGrid() {
    return (
      <div className="grid grid-cols-12 gap-y-8 pb-8 sm:gap-y-0 sm:pb-4 md:pb-0">
        {createElement(Web3GameList)}
      </div>
    )
  }

const loadWeb3GameGrid = async () => {
  const { default: Web3GameList } = await import('./_Web3GameList')

  return {
    default: createWeb3GameGrid(Web3GameList),
  }
}

export default function DeferredWeb3GameList() {
  return <DeferredSection label="Mini game cards" load={loadWeb3GameGrid} />
}
