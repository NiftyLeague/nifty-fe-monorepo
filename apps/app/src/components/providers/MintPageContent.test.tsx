import { render, screen } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

mock.module('./DeferredCharacterCreator', () => ({
  default: ({ enabled }: { enabled?: boolean }) => (
    <div data-enabled={String(enabled)} data-testid="character-creator" />
  ),
}))

const { default: MintPageContent } = await import('./MintPageContent')

describe('MintPageContent', () => {
  it('loads the creator for public visitors without wallet or ownership gating', () => {
    render(<MintPageContent />)

    expect(screen.getByTestId('character-creator').getAttribute('data-enabled')).toBe('true')
  })
})
