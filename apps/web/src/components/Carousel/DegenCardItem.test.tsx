import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import { RenderDegen } from './DegenCardItem'

describe('DegenCardItem', () => {
  it('keeps deferred NFT artwork accessible and layout-stable', () => {
    render(
      RenderDegen({
        name: 'Monopoly',
        createdDate: '9/24/2021 2:53 PM',
        source: '/img/degens/nfts/443.webp',
      })
    )

    const image = screen.getByRole('img', { name: 'Monopoly' })

    expect(image.getAttribute('src')).toBe('/img/degens/nfts/443.webp')
    expect(image.getAttribute('width')).toBe('258')
    expect(image.getAttribute('height')).toBe('278')
    expect(image.getAttribute('loading')).toBe('lazy')
    expect(image.getAttribute('decoding')).toBe('async')
  })
})
