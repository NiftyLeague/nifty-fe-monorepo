import { render, screen } from '@nl/ui/test-utils'
import { describe, expect, it } from 'bun:test'

import PublicContentContainer from './PublicContentContainer'

describe('PublicContentContainer', () => {
  it('wraps public route content in the shared padded shell', () => {
    render(() => (
      <PublicContentContainer>
        <span>Mint content</span>
      </PublicContentContainer>
    ))

    const container = screen.getByText('Mint content').parentElement
    expect(container?.className).toContain('container')
    expect(container?.className).toContain('py-5')
    expect(container?.className).toContain('md:py-10')
    expect(container?.className).not.toContain('p-0')
  })

  it('fills the main area height for embed screens when fill is set', () => {
    render(() => (
      <PublicContentContainer fill>
        <span>Embed content</span>
      </PublicContentContainer>
    ))

    const container = screen.getByText('Embed content').parentElement
    expect(container?.className).toContain('container')
    expect(container?.className).toContain('flex')
    expect(container?.className).toContain('h-full')
    expect(container?.className).toContain('min-h-0')
    expect(container?.className).toContain('flex-col')
  })
})
