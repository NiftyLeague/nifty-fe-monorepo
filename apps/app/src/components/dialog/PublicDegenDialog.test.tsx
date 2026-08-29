import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'

import type { Degen } from '@/types/degens'

let PublicDegenDialog: typeof import('./PublicDegenDialog').default

beforeEach(async () => {
  mock.module('@/components/cards/DegenCard/DegenImage', () => ({
    default: ({ tokenId, sx }: { tokenId: string | number; sx?: React.CSSProperties }) => (
      <div data-testid="degen-image" style={sx}>
        {tokenId}
      </div>
    ),
  }))
  PublicDegenDialog = (await import('./PublicDegenDialog')).default
})

afterEach(() => {
  mock.restore()
})

describe('PublicDegenDialog', () => {
  it('renders accessible public details without wallet providers', () => {
    const onClose = mock(() => {})
    const degen = {
      id: '101',
      name: 'Audit Ape',
      traits_string: 'blue, cap',
    } as Degen

    render(<PublicDegenDialog open degen={degen} onClose={onClose} />)

    expect(screen.getByRole('dialog', { name: 'Audit Ape' })).not.toBeNull()
    expect(screen.getByText('blue')).not.toBeNull()
    expect(screen.getByText('cap')).not.toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Close degen details' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('maps numeric trait ids to readable trait names and values', () => {
    render(
      <PublicDegenDialog
        open
        degen={{
          id: '1',
          name: 'Nifty Andy',
          traits_string: '1,17,73,104,110,0,263,0,0,0,0,0,685,0,717,0,0,821,824,865,894,991',
        }}
        onClose={() => {}}
      />
    )

    expect(screen.getByText('Tribe')).not.toBeNull()
    expect(screen.getByText('Ape')).not.toBeNull()
    expect(screen.getByText('Skin Color')).not.toBeNull()
    expect(screen.getByText('White')).not.toBeNull()
    expect(screen.getByText('Mouth')).not.toBeNull()
    expect(screen.getByText('Cigarette')).not.toBeNull()
    expect(screen.getByText('Footwear')).not.toBeNull()
    expect(screen.getByText('Blue Winged Shoes')).not.toBeNull()
    expect(screen.getByText('Hat')).not.toBeNull()
    expect(screen.getByText('Gray Beanie')).not.toBeNull()
    expect(screen.getByText('Right Item')).not.toBeNull()
    expect(screen.getAllByText('Controller')).toHaveLength(1)
    expect(screen.queryByText('0', { exact: true })).toBeNull()
    expect(screen.queryByText('73')).toBeNull()
    expect(screen.queryByText('263')).toBeNull()
    expect(screen.queryByText('991')).toBeNull()
  })
})
