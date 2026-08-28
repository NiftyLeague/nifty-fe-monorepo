import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import ViewTraitsContentDialog from './ViewTraitsContentDialog'

describe('ViewTraitsContentDialog', () => {
  it('renders readable labels for contract bigint trait values', () => {
    render(
      <ViewTraitsContentDialog
        displayName="Nifty Andy"
        traits={{ tribe: 1n, mouth: 263n, rightItem: 991n, empty: 0n }}
      />
    )

    expect(screen.getByText('Nifty Andy')).not.toBeNull()
    expect(screen.getByText('Tribe')).not.toBeNull()
    expect(screen.getByText('Ape')).not.toBeNull()
    expect(screen.getByText('Mouth')).not.toBeNull()
    expect(screen.getByText('Cigarette')).not.toBeNull()
    expect(screen.getByText('Right Item')).not.toBeNull()
    expect(screen.getByText('Controller')).not.toBeNull()
    expect(screen.queryByText('263')).toBeNull()
    expect(screen.queryByText('991')).toBeNull()
  })
})
