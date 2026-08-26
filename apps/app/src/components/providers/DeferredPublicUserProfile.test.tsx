import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

let isDesktopViewport = false
let loadedPlacement: 'desktop' | 'mobile' | null = null

mock.module('@nl/ui/hooks/useMediaQuery', () => ({
  useMediaQuery: () => isDesktopViewport,
}))

mock.module('@nl/ui/hooks/useDeferredComponent', () => ({
  default: (_load: unknown, enabled: boolean) => ({
    Component:
      enabled && loadedPlacement
        ? ({ placement }: { placement: 'desktop' | 'mobile' }) => (
            <div data-testid="loaded-profile" data-public-user-profile data-placement={placement} />
          )
        : null,
    hasError: false,
    retry: () => undefined,
  }),
}))

describe('DeferredPublicUserProfile', () => {
  beforeEach(() => {
    isDesktopViewport = false
    loadedPlacement = null
  })

  it('keeps the profile implementation out of the inactive navigation slot', async () => {
    loadedPlacement = 'mobile'
    const { default: DeferredPublicUserProfile } = await import('./DeferredPublicUserProfile')

    render(
      <>
        <DeferredPublicUserProfile placement="mobile" />
        <DeferredPublicUserProfile placement="desktop" />
      </>
    )

    expect(screen.getAllByTestId('loaded-profile')).toHaveLength(1)
    expect(screen.getAllByLabelText('Loading profile and login controls')).toHaveLength(1)
    expect(screen.getByTestId('loaded-profile').getAttribute('data-placement')).toBe('mobile')
  })

  it('loads the desktop profile only when the desktop slot is active', async () => {
    isDesktopViewport = true
    loadedPlacement = 'desktop'
    const { default: DeferredPublicUserProfile } = await import('./DeferredPublicUserProfile')

    render(
      <>
        <DeferredPublicUserProfile placement="mobile" />
        <DeferredPublicUserProfile placement="desktop" />
      </>
    )

    expect(screen.getAllByTestId('loaded-profile')).toHaveLength(1)
    expect(screen.getByTestId('loaded-profile').getAttribute('data-placement')).toBe('desktop')
  })
})
