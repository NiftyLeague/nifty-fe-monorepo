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

  it('maps the complete contract tuple to readable labels', () => {
    render(
      <ViewTraitsContentDialog
        displayName="Nifty Andy"
        traits={{
          tribe: 1n,
          skinColor: 17n,
          furColor: 73n,
          eyeColor: 104n,
          pupilColor: 110n,
          hair: 0n,
          mouth: 263n,
          beard: 0n,
          top: 0n,
          outerwear: 0n,
          print: 0n,
          bottom: 0n,
          footwear: 685n,
          belt: 0n,
          hat: 717n,
          eyewear: 0n,
          piercing: 0n,
          wrist: 821n,
          hands: 824n,
          neckwear: 865n,
          leftItem: 894n,
          rightItem: 991n,
          property: 0n,
        }}
      />
    )

    expect(screen.getByText('Skin Color')).not.toBeNull()
    expect(screen.getByText('White')).not.toBeNull()
    expect(screen.getByText('Footwear')).not.toBeNull()
    expect(screen.getByText('Blue Winged Shoes')).not.toBeNull()
    expect(screen.getByText('Right Item')).not.toBeNull()
    expect(screen.getByText('Controller')).not.toBeNull()
    expect(screen.queryByText('73')).toBeNull()
    expect(screen.queryByText('991')).toBeNull()
  })
})
