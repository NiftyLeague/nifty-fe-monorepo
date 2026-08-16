import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

mock.module('@nl/ui/custom/optimized-image', () => ({
  default: ({ alt, fill: _fill, priority: _priority, ...props }: React.ComponentProps<'img'>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...props} />
  ),
}))

mock.module('@nl/ui/custom/deferred-external-script', () => ({
  default: () => null,
}))

describe('DeferredHeroBackground', () => {
  let DeferredHeroBackground: typeof import('./DeferredHeroBackground').default

  beforeEach(async () => {
    DeferredHeroBackground = (await import('./DeferredHeroBackground')).default
  })

  it('keeps the above-the-fold poster on the optimized image path', () => {
    const { container } = render(<DeferredHeroBackground />)
    const poster = container.querySelector('[data-smashers-hero-background]')

    expect(poster?.getAttribute('src')).toBe('/img/games/smashers/smashers-poster.jpg')
    expect(poster?.getAttribute('unoptimized')).toBeNull()
  })
})
