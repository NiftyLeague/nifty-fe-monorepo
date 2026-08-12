import { render } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'
import { CircularProgress } from './index'

describe('CircularProgress', () => {
  it('renders the lightweight loader with shared size and color aliases', () => {
    const { container } = render(
      <CircularProgress size="sm" color="light" fill="none" className="m-auto" />
    )
    const spinner = container.querySelector('svg')

    expect(spinner).not.toBeNull()
    expect(spinner?.getAttribute('width')).toBe('18')
    expect(spinner?.getAttribute('height')).toBe('18')
    expect(spinner?.getAttribute('stroke')).toBe('var(--color-light)')
    expect(spinner?.getAttribute('fill')).toBe('none')
    expect(spinner?.getAttribute('aria-hidden')).toBe('true')
    expect(spinner?.getAttribute('class')).toContain('animate-spin')
    expect(spinner?.getAttribute('class')).toContain('m-auto')
  })

  it('accepts a numeric size and preserves custom SVG props', () => {
    const { container } = render(<CircularProgress size={75} color="#fff" data-testid="spinner" />)
    const spinner = container.querySelector('[data-testid="spinner"]')

    expect(spinner?.getAttribute('width')).toBe('75')
    expect(spinner?.getAttribute('height')).toBe('75')
    expect(spinner?.getAttribute('stroke')).toBe('#fff')
    expect(spinner?.getAttribute('aria-hidden')).toBe('true')
  })
})
