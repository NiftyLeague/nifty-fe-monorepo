import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

mock.module('next/image', () => ({
  default: ({ alt, unoptimized: _unoptimized, ...props }: React.ComponentProps<'img'>) => (
    <img alt={alt} {...props} />
  ),
}))

describe('AnimatedImage', () => {
  let AnimatedImage: typeof import('./index').AnimatedImage

  beforeEach(async () => {
    AnimatedImage = (await import('./index')).AnimatedImage
  })

  it('keeps a native fallback alongside the optimized animated source', () => {
    const { container } = render(
      <AnimatedImage
        src="/img/items/full/1.gif"
        webpSrc="/img/items/full/1.webp"
        alt="Cape"
        width={98}
        height={98}
        loading="lazy"
        unoptimized
      />
    )
    const picture = container.querySelector('picture')

    expect(picture?.querySelector('source')?.getAttribute('type')).toBe('image/webp')
    expect(picture?.querySelector('source')?.getAttribute('srcset')).toBe('/img/items/full/1.webp')
    expect(picture?.querySelector('img')?.getAttribute('src')).toBe('/img/items/full/1.gif')
    expect(picture?.querySelector('img')?.getAttribute('alt')).toBe('Cape')
  })
})
