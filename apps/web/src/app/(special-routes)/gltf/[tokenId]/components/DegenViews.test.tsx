import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

mock.module('next/dynamic', () => ({
  default: () => () => null,
}))

mock.module('./ModelView', () => ({
  default: ({ tokenId }: { tokenId: string }) => (
    <div data-testid="model-view">3D model {tokenId}</div>
  ),
}))

mock.module('./ModelActions', () => ({
  default: () => <div data-testid="model-actions">Model actions</div>,
}))

import DegenViews from './DegenViews'

describe('DegenViews', () => {
  it('keeps the lightweight 2D surface initial and loads 3D on selection', async () => {
    render(
      <DegenViews
        tokenId="42"
        initialImage={<div data-testid="initial-image">2D degen</div>}
        spriteImage={<div data-testid="sprite-image">Degen Sprite</div>}
        logo={<span>Nifty League</span>}
      />
    )

    expect(screen.getByRole('radio', { name: 'Toggle 2D' }).getAttribute('data-state')).toBe('on')
    expect(screen.queryByTestId('model-view')).toBeNull()

    fireEvent.click(screen.getByRole('radio', { name: 'Toggle 3D' }))

    expect(await screen.findByTestId('model-view')).toBeDefined()
    expect(screen.getByTestId('model-actions')).toBeDefined()
  })

  it('keeps Sprite available without loading the 3D surface', () => {
    render(
      <DegenViews
        tokenId="42"
        initialImage={<div data-testid="initial-image">2D degen</div>}
        spriteImage={<div data-testid="sprite-image">Degen Sprite</div>}
        logo={<span>Nifty League</span>}
      />
    )

    fireEvent.click(screen.getByRole('radio', { name: 'Toggle Sprite' }))

    expect(screen.getByTestId('sprite-image')).toBeDefined()
    expect(screen.queryByTestId('model-view')).toBeNull()
  })
})
