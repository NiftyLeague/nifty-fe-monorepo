import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import { PrivateRoutesLoading } from './PrivateRoutesBoundary'

describe('PrivateRoutes loading boundary', () => {
  it('keeps an accessible shell while the private app loads', () => {
    render(<PrivateRoutesLoading />)

    expect(screen.getByRole('status').getAttribute('aria-busy')).toBe('true')
    expect(screen.getByText('Loading private app')).toBeTruthy()
    expect(screen.getAllByRole('status')).toHaveLength(1)
  })
})
