import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

const dynamicLoaders: Array<() => Promise<unknown>> = []

mock.module('next/dynamic', () => ({
  default: (loader: () => Promise<unknown>) => {
    const Deferred = () => {
      dynamicLoaders.push(loader)
      return <span data-testid="rank-action-loaded" />
    }
    return Deferred
  },
}))

describe('LeaderboardRankBoundary', () => {
  beforeEach(() => {
    dynamicLoaders.length = 0
    window.localStorage.clear()
  })

  it('does not load wallet rank controls for signed-out visitors', async () => {
    window.localStorage.setItem('nifty-auth-status', 'false')
    const { default: LeaderboardRankBoundary } = await import('./LeaderboardRankBoundary')

    render(
      <LeaderboardRankBoundary
        selectedGame="nifty_smashers"
        selectedTable="kills"
        selectedTimeFilter="all_time"
      />
    )

    expect(screen.queryByTestId('rank-action-loaded')).toBeNull()
    expect(dynamicLoaders).toHaveLength(0)
  })

  it('loads wallet rank controls only for signed-in visitors', async () => {
    window.localStorage.setItem('nifty-auth-status', 'true')
    const { default: LeaderboardRankBoundary } = await import('./LeaderboardRankBoundary')

    render(
      <LeaderboardRankBoundary
        selectedGame="nifty_smashers"
        selectedTable="kills"
        selectedTimeFilter="all_time"
      />
    )

    expect(screen.getByTestId('rank-action-loaded')).toBeTruthy()
    expect(dynamicLoaders).toHaveLength(1)
  })
})
