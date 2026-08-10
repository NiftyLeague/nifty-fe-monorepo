import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import StaticSection from './StaticSection'

describe('StaticSection', () => {
  it('renders the shared section title, actions, and server-compatible content slot', () => {
    render(
      <StaticSection firstSection title="Free-2-Play Games" actions={<button>Install</button>}>
        <p>Game cards</p>
      </StaticSection>
    )

    expect(screen.getByRole('heading', { name: 'Free-2-Play Games' })).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Install' })).not.toBeNull()
    expect(screen.getByText('Game cards')).not.toBeNull()
  })
})
