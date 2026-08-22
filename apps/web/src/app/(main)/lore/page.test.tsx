import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'
import type { ComponentProps } from 'react'

/* eslint-disable @next/next/no-img-element */

mock.module('@nl/ui/custom/theme-button-group', () => ({
  default: () => null,
}))

mock.module('@nl/ui/custom/optimized-image', () => ({
  default: ({ alt, ...props }: ComponentProps<'img'>) => <img alt={alt} {...props} />,
  getOptimizedImageProps: ({ src, ...props }: ComponentProps<'img'>) => ({
    ...props,
    src,
    srcSet: `${src} 640w`,
  }),
}))

describe('lore page', () => {
  let Lore: typeof import('./page').default

  beforeEach(async () => {
    Lore = (await import('./page')).default
  })

  it('uses an optimized mobile background without requesting desktop art on small screens', () => {
    render(<Lore />)

    const picture = document.querySelector('picture')
    const mobileSource = picture?.querySelector('source[media="(max-width: 768px)"]')
    const desktopImage = picture?.querySelector('img')

    const mobileSrcSet = mobileSource?.getAttribute('srcset')
    const desktopSrc = desktopImage?.getAttribute('src')

    expect(mobileSrcSet).toBeDefined()
    expect(mobileSrcSet).toContain('/img/backgrounds/lore/background-mobile.webp')
    expect(desktopSrc).toBeDefined()
    expect(desktopSrc).toContain('/img/backgrounds/lore/background.webp')
    expect(desktopImage?.getAttribute('loading')).toBe('eager')
  })
})
