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
    expect(screen.getAllByRole('status').length).toBe(1)
    expect(useOnScreen).toHaveBeenCalledWith(expect.anything(), '320px', { once: true })
  })
})
