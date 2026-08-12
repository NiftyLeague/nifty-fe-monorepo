import { render } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import { AppNavIcon } from './AppNavIcon'

describe('AppNavIcon', () => {
  it('keeps mapped navigation icons decorative and preserves theme defaults', () => {
    const { container, rerender } = render(
      <AppNavIcon name="layout-grid" size="lg" color="blue" fill="dim" />
    )
    const icon = container.querySelector('svg')

    expect(icon).not.toBeNull()
    expect(icon?.getAttribute('aria-hidden')).toBe('true')
    expect(icon?.getAttribute('width')).toBe('24')
    expect(icon?.getAttribute('height')).toBe('24')
    expect(icon?.getAttribute('fill')).toBe('var(--color-muted-foreground)')
    expect(icon?.getAttribute('stroke')).toBe('var(--color-blue)')
    expect(icon?.getAttribute('class')).toContain('lucide-layout-grid')

    rerender(<AppNavIcon name="settings" aria-label="Settings" />)
    const labeledIcon = container.querySelector('svg')

    expect(labeledIcon?.getAttribute('aria-hidden')).toBeNull()
    expect(labeledIcon?.getAttribute('aria-label')).toBe('Settings')
  })
})
