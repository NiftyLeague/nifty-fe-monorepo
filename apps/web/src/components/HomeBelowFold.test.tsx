/* eslint-disable @next/next/no-img-element */

import { render, screen } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'
import type { ComponentProps } from 'react'

mock.module('@nl/ui/custom/deferred-section', () => ({
  DeferredSection: ({ label }: { label: string }) => (
    <div role="status" aria-label={`Loading ${label}`}>
      Loading {label}
    </div>
  ),
}))

mock.module('@nl/ui/custom/optimized-image', () => ({
  default: (props: ComponentProps<'img'>) => <img alt="" {...props} />,
  getOptimizedImageProps: (props: ComponentProps<'img'>) => props,
}))

mock.module('@nl/ui/custom/theme-button-group', () => ({
  ThemeButtonGroup: () => null,
}))

mock.module('@/components/BouncingNFTL', () => ({
  default: () => null,
}))

describe('HomeBelowFold', () => {
  it('preserves responsive labels inside the deferred DEGEN section', async () => {
    const { HomeDegensSection } = await import('./HomeBelowFold')

    render(<HomeDegensSection />)

    expect(screen.getByText('OWN YOUR AVATAR').className).toContain('responsive-label-mobile')
    expect(screen.getByText('COMMUNITY-GENERATED AVATARS').className).toContain(
      'responsive-label-desktop'
    )
  })
})
