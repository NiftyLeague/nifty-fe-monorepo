import { render } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import { NavIcon } from './index'

describe('NavIcon', () => {
  it('renders decorative themed glyphs without a client-only icon registry', () => {
    const { container } = render(<NavIcon name="gamepad" className="text-sidebar-foreground" />)
    const icon = container.querySelector('svg')

    expect(icon).not.toBeNull()
    expect(icon?.getAttribute('aria-hidden')).toBe('true')
    expect(icon?.getAttribute('stroke')).toBe('currentColor')
    expect(icon?.getAttribute('class')).toBe('text-sidebar-foreground')
    expect(icon?.querySelector('rect')).not.toBeNull()
  })

  it('supports an accessible label when the glyph carries meaning', () => {
    const { container } = render(<NavIcon name="sparkles" aria-label="Mint-O-Matic" />)
    const icon = container.querySelector('svg')

    expect(icon?.getAttribute('aria-label')).toBe('Mint-O-Matic')
    expect(icon?.getAttribute('aria-hidden')).toBeNull()
  })

  it('shares the lightweight check glyph used by marketing timelines', () => {
    const { container } = render(<NavIcon name="check" />)
    const icon = container.querySelector('svg')

    expect(icon?.querySelector('path')?.getAttribute('d')).toBe('M20 6 9 17l-5-5')
  })

  it('renders the shared navigation controls without a client icon dependency', () => {
    const { container } = render(
      <>
        <NavIcon name="menu" />
        <NavIcon name="x" />
      </>
    )

    expect(container.querySelectorAll('svg')).toHaveLength(2)
    expect(container.querySelectorAll('line')).toHaveLength(3)
    expect(container.querySelector('svg:last-of-type path')?.getAttribute('d')).toBe('M18 6 6 18')
  })
})
