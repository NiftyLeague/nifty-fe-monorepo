import { render } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import { ExternalIcon } from './index'

describe('ExternalIcon', () => {
  it('keeps a fixed decorative icon size in shared link layouts', () => {
    const { container } = render(<ExternalIcon />)
    const icon = container.querySelector('svg')

    expect(icon?.getAttribute('width')).toBe('14')
    expect(icon?.getAttribute('height')).toBe('14')
    expect(icon?.getAttribute('aria-hidden')).toBe('true')
    expect(icon?.getAttribute('focusable')).toBe('false')
    expect(icon?.getAttribute('viewBox')).toBe('0 0 24 24')
    expect(icon?.querySelectorAll('path')).toHaveLength(3)
  })
})
