import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

mock.module('@/hooks/useImageOnLoad', () => ({
  default: () => ({
    handleImageOnLoad: () => undefined,
    css: { thumbnail: {}, fullSize: {} },
  }),
}))

let ImageCard: typeof import('./ImageCard').default

beforeEach(async () => {
  ImageCard = (await import('./ImageCard')).default
})

describe('ImageCard', () => {
  it('keeps external marketplace media lazy through the shared image primitive', () => {
    render(
      <ImageCard
        thumbnail="https://cdn.example.test/thumb.webp"
        image="https://cdn.example.test/full.webp"
        title="Marketplace item"
        ratio={1}
      />
    )

    const images = screen.getAllByRole('img')

    expect(images).toHaveLength(2)
    expect(images[0].getAttribute('alt')).toBe('thumbnail-Marketplace item')
    expect(images[1].getAttribute('alt')).toBe('Marketplace item')

    for (const image of images) {
      expect(image.getAttribute('loading')).toBe('lazy')
      expect(image.getAttribute('fetchpriority')).toBe('low')
      expect(image.getAttribute('decoding')).toBe('async')
    }
  })
})
