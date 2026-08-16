import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

const observedRootMargins: string[] = []

mock.module('@nl/ui/hooks/useOnScreen', () => ({
  useOnScreen: (_ref: unknown, rootMargin: string) => {
    observedRootMargins.push(rootMargin)
    return false
  },
}))

mock.module('@nl/ui/custom/deferred-component', () => ({
  default: ({ label }: { label: string }) => <div data-testid="deferred-card">{label}</div>,
}))

describe('DeferredDegenCard', () => {
  beforeEach(() => {
    observedRootMargins.length = 0
  })

  it('uses the shared near-viewport window for public and dashboard cards', async () => {
    const { default: DeferredDegenCard, DEFERRED_DEGEN_CARD_ROOT_MARGIN } =
      await import('./DeferredDegenCard')

    render(<DeferredDegenCard degen={{ id: '1', name: 'Nifty Andy' }} />)

    expect(DEFERRED_DEGEN_CARD_ROOT_MARGIN).toBe('160px')
    expect(observedRootMargins).toEqual(['160px'])
    expect(screen.getByTestId('deferred-card').textContent).toBe('DEGEN card')
  })
})
