import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import { DegenRouteLoading } from './DegenRoute'

describe('DegenRoute loading boundary', () => {
  it('keeps an accessible reserved shell while the browser route loads', () => {
    render(<DegenRouteLoading />)

    expect(screen.getByRole('status').getAttribute('aria-busy')).toBe('true')
    expect(screen.getByText('Loading degens')).toBeTruthy()
    expect(screen.getAllByRole('status')).toHaveLength(1)
  })
})
