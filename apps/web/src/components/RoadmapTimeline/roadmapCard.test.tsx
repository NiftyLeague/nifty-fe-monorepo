import { render, screen } from '@nl/ui/test-utils'
import { describe, expect, it, mock } from 'bun:test'

mock.module('@nl/ui/custom/animated-image', () => ({
  AnimatedImage: ({
    src,
    alt,
    ...props
  }: { src: string; alt: string } & Record<string, unknown>) => (
    <img src={src} alt={alt} {...props} />
  ),
}))

mock.module('@nl/ui/custom/optimized-image', () => ({
  default: ({ src, alt, ...props }: Record<string, unknown>) => (
    <img src={src} alt={alt} {...props} />
  ),
}))

mock.module('@nl/ui/custom/deferred-animated-image', () => ({
  DeferredAnimatedImage: ({
    animatedSrc,
    src,
    alt,
  }: {
    animatedSrc?: string
    src: string
    alt: string
  }) => <img src={src} alt={alt} data-animated-src={animatedSrc} />,
}))

mock.module('@nl/ui/custom/deferred-animated-image', () => ({
  DeferredAnimatedImage: ({
    animatedSrc,
    src,
    alt,
  }: {
    animatedSrc?: string
    src: string
    alt: string
  }) => <img src={src} alt={alt} data-animated-src={animatedSrc} />,
}))

describe('RoadmapCard', () => {
  it('keeps alternating sides independent of deferred DOM wrappers', async () => {
    const { default: RoadmapCard, getRoadmapCardSide } = await import('./roadmapCard')

    expect(getRoadmapCardSide(0)).toBe('left')
    expect(getRoadmapCardSide(1)).toBe('right')
    expect(getRoadmapCardSide(2)).toBe('left')

    render(() => <RoadmapCard body={<p>Details</p>} side="right" title="Desktop App" />)

    expect(
      screen
        .getByRole('heading', { name: 'Desktop App' })
        .closest('[data-timeline-side]')
        ?.getAttribute('data-timeline-side')
    ).toBe('right')
  })

  it('keeps overflowing milestone artwork outside the paint-contained card content', async () => {
    const { default: RoadmapCard } = await import('./roadmapCard')

    render(() => (
      <RoadmapCard
        body={<p>Details</p>}
        image={{
          src: 'https://cdn.niftyleague.com/media/img/roadmap/nifty_roadmap.webp',
          width: 200,
          height: 120,
          style: { top: '-80px' },
        }}
        title="Desktop App"
      />
    ))

    const image = screen.getByRole('img', { name: 'Desktop App' })
    const title = screen.getByRole('heading', { name: 'Desktop App' })

    expect(image.parentElement?.parentElement).not.toBe(title.parentElement)
  })

  it('uses the static roadmap poster until an animated GIF is near the viewport', async () => {
    const { default: RoadmapCard } = await import('./roadmapCard')

    render(() => (
      <RoadmapCard
        body={<p>Details</p>}
        image={{
          src: 'https://cdn.niftyleague.com/media/img/games/wen.gif',
          posterSrc: 'https://cdn.niftyleague.com/media/img/games/wen-roadmap-poster.webp',
          width: 200,
          height: 120,
          style: { top: '-80px' },
        }}
        title="WEN Game"
      />
    ))

    const image = screen.getByRole('img', { name: 'WEN Game' })

    expect(image.getAttribute('src')).toBe(
      'https://cdn.niftyleague.com/media/img/games/wen-roadmap-poster.webp'
    )
    expect(image.getAttribute('data-animated-src')).toBe(
      'https://cdn.niftyleague.com/media/img/games/wen.gif'
    )
  })

  it('uses the shared optimized image path for static roadmap artwork', async () => {
    const { default: RoadmapCard } = await import('./roadmapCard')

    render(() => (
      <RoadmapCard
        body={<p>Details</p>}
        image={{
          src: 'https://cdn.niftyleague.com/media/img/roadmap/nifty_roadmap.webp',
          width: 200,
          height: 120,
          style: { top: '-80px' },
        }}
        title="Desktop App"
      />
    ))

    const image = screen.getByRole('img', { name: 'Desktop App' })

    expect(image.getAttribute('loading')).toBe('lazy')
    expect(image.getAttribute('fetchpriority')).toBe('low')
  })
})
