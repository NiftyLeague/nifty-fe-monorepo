import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import AppBar from './index'

describe('AppBar', () => {
  it('keeps the shared responsive spacing contract', () => {
    const { container } = render(<AppBar>Shell controls</AppBar>)

    const appBar = container.firstElementChild

    expect(appBar?.className).toContain('box-border')
    expect(appBar?.className).toContain('min-h-14')
    expect(appBar?.className).toContain('px-4')
    expect(appBar?.className).toContain('py-2')
    expect(appBar?.className).toContain('lg:h-[60px]')
    expect(appBar?.className).toContain('lg:px-6')
    expect(appBar?.className).toContain('lg:py-0')
  })
})
