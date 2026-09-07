import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

let deferredProps: { label?: string; load?: unknown } = {}

mock.module('@nl/ui/custom/deferred-section', () => ({
  default: (props: { label: string; load: unknown }) => {
    deferredProps = props
    return <div data-testid="deferred-game-list" data-label={props.label} />
  },
}))

describe('deferred Web3 game list', () => {
  beforeEach(async () => {
    deferredProps = {}
  })

  it('keeps the lower game catalog behind the shared deferred section', async () => {
    const { default: DeferredWeb3GameList } = await import('./DeferredWeb3GameList')

    render(<DeferredWeb3GameList />)

    expect(screen.getByTestId('deferred-game-list').getAttribute('data-label')).toBe(
      'Web3 game cards'
    )
    expect(deferredProps.load).toBeFunction()
  })
})
