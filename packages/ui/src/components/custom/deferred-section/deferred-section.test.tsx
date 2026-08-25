import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

const useOnScreen = mock(() => false)
mock.module('@nl/ui/hooks/useOnScreen', () => ({ useOnScreen }))

describe('DeferredSection', () => {
  let DeferredSection: typeof import('./index').DeferredSection

  beforeEach(async () => {
    DeferredSection = (await import('./index')).DeferredSection
  })

  it('keeps an accessible, themed loading state before content is near the viewport', () => {
    const { container } = render(
      <DeferredSection label="Game details" load={async () => ({ default: () => null })} />
    )

    expect(screen.getByRole('status', { name: 'Loading Game details' })).toBeTruthy()
    expect(container.firstElementChild?.getAttribute('aria-busy')).toBe('true')
    expect(container.firstElementChild?.classList.contains('deferred-section')).toBe(true)
    expect(screen.getAllByRole('status').length).toBe(1)
    expect(useOnScreen).toHaveBeenCalledWith(expect.anything(), '160px', { once: true })
  })

  it('supports a transparent loading state for layout-preserving sections', () => {
    const { container } = render(
      <DeferredSection
        label="Marketing section"
        load={async () => ({ default: () => null })}
        minHeightClassName="min-h-96"
        loadingMode="minimal"
      />
    )

    expect(screen.getByRole('status', { name: 'Loading Marketing section' })).toBeTruthy()
    expect(container.querySelector('.deferred-section-minimal')?.className).toContain('min-h-96')
    expect(container.querySelector('[data-slot="skeleton"]')).toBeNull()
  })
})
