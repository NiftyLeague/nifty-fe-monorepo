import { render, screen, waitFor } from '@nl/ui/test-utils'
import { describe, expect, it } from 'bun:test'
import { createSignal } from 'solid-js'

import HoverDataCard from './HoverDataCard'

// Regression coverage for the React-era prop destructure that froze
// `isLoading` at mount: the card must clear its skeleton when the signal
// flips, not stay stuck on the initial value.
describe('HoverDataCard', () => {
  it('clears the loading skeleton when isLoading flips', async () => {
    const [isLoading, setIsLoading] = createSignal(true)

    render(() => <HoverDataCard title="Game Balance" primary="42 NFTL" isLoading={isLoading()} />)

    expect(screen.queryByText('42 NFTL')).toBeNull()

    setIsLoading(false)

    await waitFor(() => expect(screen.getByText('42 NFTL')).toBeTruthy())
    expect(screen.getByText('Game Balance')).toBeTruthy()
  })
})
