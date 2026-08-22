import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'

import type { Degen } from '@/types/degens'

let DegenCard: typeof import('./index').default

beforeEach(async () => {
  mock.module('./DegenImage', () => ({
    default: ({ tokenId }: { tokenId: string }) => <div data-testid="degen-image">{tokenId}</div>,
  }))
  DegenCard = (await import('./index')).default
})

afterEach(() => {
  mock.restore()
})

const publicDegen = {
  id: '1',
  name: 'Nifty Andy',
  owner: '0x0000000000000000000000000000000000000000',
} as Degen

describe('DegenCard', () => {
  it('renders the public card without wallet or auth providers', () => {
    render(<DegenCard degen={publicDegen} />)

    expect(screen.getByRole('heading', { name: 'Nifty Andy' })).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Details' })).not.toBeNull()
    expect(screen.queryByRole('button', { name: /favorite/i })).toBeNull()
  })

  it('keeps the marketplace identifier as a native external link', () => {
    render(<DegenCard degen={publicDegen} />)

    const marketplaceLink = screen.getByRole('link', { name: '#1' })
    expect(marketplaceLink.tagName).toBe('A')
    expect(marketplaceLink.getAttribute('target')).toBe('_blank')
    expect(marketplaceLink.getAttribute('rel')).toBe('nofollow')
  })
})
