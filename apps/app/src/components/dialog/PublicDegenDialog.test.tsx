import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'

import type { Degen } from '@/types/degens'

let PublicDegenDialog: typeof import('./PublicDegenDialog').default

beforeEach(async () => {
  mock.module('@/components/cards/DegenCard/DegenImage', () => ({
    default: ({ tokenId }: { tokenId: string }) => <div data-testid="degen-image">{tokenId}</div>,
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
})
