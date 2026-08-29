import { render, screen } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

import type { DashboardDegen } from '@/types/degens'

mock.module('@/components/cards/DegenCard/DegenImage', () => ({
  default: ({ tokenId, sx }: { tokenId: string | number; sx?: React.CSSProperties }) => (
    <div data-testid={`degen-image-${tokenId}`} style={sx} />
  ),
}))

const { default: ViewTraitsContentDialog } = await import('./ViewTraitsContentDialog')

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

  it('normalizes index-shaped trait maps and keeps the image inside its column', () => {
    const traits = Object.fromEntries(
      [1, 17, 73, 104, 110, 0, 263, 0, 0, 0, 0, 0, 685, 0, 717, 0, 0, 821, 824, 865, 894, 991].map(
        (value, index) => [String(index), BigInt(value)]
      )
    )

    render(
      <ViewTraitsContentDialog
        degen={{ id: '1' } as DashboardDegen}
        displayName="Nifty Andy"
        traits={traits}
      />
    )

    expect(screen.getByText('Tribe')).not.toBeNull()
    expect(screen.getByText('Ape')).not.toBeNull()
    expect(screen.getByText('Skin Color')).not.toBeNull()
    expect(screen.getByText('White')).not.toBeNull()
    expect(screen.getByText('Right Item')).not.toBeNull()
    expect(screen.getByText('Controller')).not.toBeNull()
    expect(screen.queryByText('17')).toBeNull()
    expect(screen.queryByText('991')).toBeNull()

    const image = screen.getByTestId('degen-image-1')
    expect(image.style.width).toBe('100%')
    expect(image.style.maxWidth).toBe('100%')
    expect(image.style.height).toBe('auto')
    expect(image.parentElement?.className).toContain('max-w-[500px]')
  })
})
