'use client'

import { useEffect, useRef, useState } from 'react'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'

type Web3GameListComponent = typeof import('./_Web3GameList').default

const LoadingWeb3GameList = ({ error = false }: { error?: boolean }) => (
  <div className="col-span-12 min-h-24" role="status" aria-busy={!error} aria-live="polite">
    <span className="sr-only">
      {error ? 'Web3 games could not be loaded' : 'Loading Web3 games'}
    </span>
  </div>
)

export default function Web3GameList() {
  const listRef = useRef<HTMLDivElement>(null)
  const isNearViewport = useOnScreen(listRef, '200px')
  const [GameList, setGameList] = useState<Web3GameListComponent | null>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!isNearViewport || GameList) return

    let active = true

    void import('./_Web3GameList')
      .then(({ default: LoadedGameList }) => {
        if (active) setGameList(() => LoadedGameList)
      })
      .catch(() => {
        if (active) setHasError(true)
      })

    return () => {
      active = false
    }
  }, [GameList, isNearViewport])

  return (
    <div ref={listRef} className={GameList ? 'contents' : 'col-span-12 min-h-24'}>
      {GameList ? <GameList /> : <LoadingWeb3GameList error={hasError} />}
    </div>
  )
}
