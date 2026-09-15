import { render, screen } from '@nl/ui/test-utils'
import { describe, expect, it } from 'bun:test'

import PublicContentContainer from './PublicContentContainer'

describe('PublicContentContainer', () => {
  it('can flush route content to the full public main surface', () => {
    render(() => (
      <PublicContentContainer flush>
        <span>Mint content</span>
      </PublicContentContainer>
    ))

    const container = screen.getByText('Mint content').parentElement
    expect(container?.className).toContain('p-0')
    expect(container?.className).toContain('h-full')
    expect(container?.className).not.toContain('py-5')
    expect(container?.className).not.toContain('md:py-10')
  })
})
