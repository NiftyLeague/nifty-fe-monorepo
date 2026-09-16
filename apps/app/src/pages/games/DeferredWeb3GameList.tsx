import { Dynamic } from 'solid-js/web'
import DeferredSection from '@nl/ui/custom/deferred-section'

const loadWeb3GameGrid = async () => {
  const { default: Web3GameList } = await import('./_Web3GameList')

  return {
    default: () => (
      <div class="grid grid-cols-12 gap-y-8 pb-8 sm:gap-y-0 sm:pb-4 md:pb-0">
        <Dynamic component={Web3GameList} />
      </div>
    ),
  }
}

export default function DeferredWeb3GameList() {
  return <DeferredSection label="Mini game cards" load={loadWeb3GameGrid} />
}
