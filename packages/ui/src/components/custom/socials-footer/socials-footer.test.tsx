import { render } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

mock.module('@nl/ui/custom/optimized-image', () => ({
  default: ({ alt, ...props }: React.ComponentProps<'img'>) => <img alt={alt} {...props} />,
}))

const { default: SocialsFooter } = await import('./index')

describe('SocialsFooter', () => {
  it('defers below-the-fold rendering without changing its semantic footer', () => {
    const { container } = render(<SocialsFooter />)
    const footer = container.querySelector('footer')

    expect(footer).not.toBeNull()
    expect(footer?.className).toContain('deferred-footer')
  })
})
