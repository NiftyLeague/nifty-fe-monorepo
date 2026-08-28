/* eslint-disable @next/next/no-img-element -- native image mocks keep this unit test isolated. */
import { render, screen } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

mock.module('@nl/ui/custom/animated-image', () => ({
  AnimatedImage: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

mock.module('@nl/ui/custom/optimized-image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

describe('RoadmapCard', () => {
  it('keeps alternating sides independent of deferred DOM wrappers', async () => {
    const { default: RoadmapCard, getRoadmapCardSide } = await import('./roadmapCard')

    expect(getRoadmapCardSide(0)).toBe('left')
    expect(getRoadmapCardSide(1)).toBe('right')
    expect(getRoadmapCardSide(2)).toBe('left')

    render(<RoadmapCard body={<p>Details</p>} side="right" title="Desktop App" />)

    expect(
      screen
        .getByRole('heading', { name: 'Desktop App' })
        .closest('[data-timeline-side]')
        ?.getAttribute('data-timeline-side')
    ).toBe('right')
  })

  it('keeps overflowing milestone artwork outside the paint-contained card content', async () => {
    const { default: RoadmapCard } = await import('./roadmapCard')

    render(
      <RoadmapCard
        body={<p>Details</p>}
        image={{ src: '/img/roadmap/app.webp', width: 200, height: 120, style: { top: '-80px' } }}
        title="Desktop App"
      />
    )

    const image = screen.getByRole('img', { name: 'Desktop App' })
    const title = screen.getByRole('heading', { name: 'Desktop App' })

    expect(image.parentElement?.parentElement).not.toBe(title.parentElement)
  })
})
