import { render } from '@nl/ui/test-utils'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

mock.module('@nl/ui/custom/responsive-only-image', () => ({
  DesktopOnlyImage: (props: Record<string, unknown>) => <img {...props} />,
  default: (props: Record<string, unknown>) => <img {...props} />,
}))

describe('BouncingNFTL', () => {
  let BouncingNFTL: typeof import('./index').default

  beforeEach(async () => {
    BouncingNFTL = (await import('./index')).default
  })

  it('renders only the requested token artwork', () => {
    const { container } = render(() => <BouncingNFTL visibleTokens={['token1', 'token3']} />)

    expect(
      [...container.querySelectorAll('img')].map((image) => image.getAttribute('src'))
    ).toEqual([
      'https://cdn.niftyleague.com/media/img/compete-and-earn/animated/token-1.webp',
      'https://cdn.niftyleague.com/media/img/compete-and-earn/animated/token-3.webp',
    ])
  })
})
