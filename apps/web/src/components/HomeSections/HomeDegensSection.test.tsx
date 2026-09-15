import { render, screen } from '@nl/ui/test-utils'
import { describe, expect, it, mock } from 'bun:test'

mock.module('@nl/ui/custom/deferred-section', () => ({
  DeferredSection: ({ label }: { label: string }) => (
    <div role="status" aria-label={`Loading ${label}`}>
      Loading {label}
    </div>
  ),
}))

mock.module('@nl/ui/custom/optimized-image', () => ({
  default: (props: Record<string, unknown>) => <img alt="" {...props} />,
  getOptimizedImageProps: (props: Record<string, unknown>) => props,
}))

mock.module('@nl/ui/custom/theme-button-group', () => ({
  ThemeButtonGroup: () => null,
}))

mock.module('@/components/BouncingNFTL', () => ({
  default: () => null,
}))

describe('HomeDegensSection', () => {
  it('preserves responsive labels inside the deferred DEGEN section', async () => {
    const { default: HomeDegensSection } = await import('./HomeDegensSection')

    render(() => <HomeDegensSection />)

    expect(screen.getByText('OWN YOUR AVATAR').className).toContain('responsive-label-mobile')
    expect(screen.getByText('COMMUNITY-GENERATED AVATARS').className).toContain(
      'responsive-label-desktop'
    )
  })
})
