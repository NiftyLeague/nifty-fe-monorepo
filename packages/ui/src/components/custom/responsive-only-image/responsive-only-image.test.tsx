import { render } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

mock.module('@nl/ui/custom/optimized-image', () => ({
  getOptimizedImageProps: ({
    alt,
    fetchPriority,
    height,
    loading,
    sizes,
    src,
    width,
  }: Record<string, unknown>) => ({
    alt,
    fetchPriority,
    height,
    loading,
    sizes,
    src,
    srcSet: `${src} 1x`,
    width,
  }),
}))

describe('ResponsiveOnlyImage', () => {
  it('keeps the responsive source and placeholder fallback art-directed', async () => {
    const { DesktopOnlyImage, MobileOnlyImage } = await import('./index')
    const { container } = render(
      <>
        <DesktopOnlyImage
          alt="Desktop artwork"
          fetchPriority="high"
          height={100}
          sizes="100vw"
          src="/desktop.webp"
          width={200}
        />
        <MobileOnlyImage
          alt="Mobile artwork"
          height={100}
          sizes="100vw"
          src="/mobile.webp"
          width={200}
        />
      </>
    )

    const sources = [...container.querySelectorAll('source')]
    expect(sources.map((source) => source.getAttribute('media'))).toEqual([
      '(min-width: 769px)',
      '(max-width: 768px)',
    ])
    expect(sources.map((source) => source.getAttribute('srcset'))).toEqual([
      '/desktop.webp 1x',
      '/mobile.webp 1x',
    ])
    expect(
      [...container.querySelectorAll('img')].every((image) =>
        image.getAttribute('src')?.startsWith('data:image/gif;base64,')
      )
    ).toBe(true)
    expect(container.querySelectorAll('img')[0]?.getAttribute('fetchpriority')).toBe('high')
  })
})
