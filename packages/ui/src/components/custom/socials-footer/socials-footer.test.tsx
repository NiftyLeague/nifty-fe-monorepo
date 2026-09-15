import { render } from '@nl/ui/test-utils'
import { describe, expect, it, mock } from 'bun:test'

mock.module('@nl/ui/custom/optimized-image', () => ({
  default: ({ alt, ...props }: import('solid-js').ComponentProps<'img'>) => (
    <img alt={alt} {...props} />
  ),
}))

const { default: SocialsFooter } = await import('./index')

describe('SocialsFooter', () => {
  it('defers below-the-fold rendering without changing its semantic footer', () => {
    const { container } = render(() => <SocialsFooter />)
    const footer = container.querySelector('footer')

    expect(footer).not.toBeNull()
    expect(footer?.className).toContain('deferred-footer')
  })
})
