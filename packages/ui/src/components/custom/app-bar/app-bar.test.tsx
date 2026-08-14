import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import AppBar from './index'

describe('AppBar', () => {
  it('keeps the shared responsive spacing contract', () => {
    const { container } = render(<AppBar>Shell controls</AppBar>)

    const appBar = container.firstElementChild

    expect(appBar?.getAttribute('data-slot')).toBe('app-bar')
    expect(appBar?.getAttribute('data-layout')).toBe('responsive')
  })
})
