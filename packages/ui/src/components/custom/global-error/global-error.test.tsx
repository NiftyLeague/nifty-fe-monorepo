import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

import { GlobalErrorPage } from './index'

describe('GlobalErrorPage', () => {
  it('renders a themed, accessible retry state', () => {
    const onRetry = mock()

    render(<GlobalErrorPage onRetry={onRetry} />)

    expect(screen.getByRole('alert')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeTruthy()
    expect(screen.getByText(/unexpected error interrupted this page/i)).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeTruthy()
    expect(screen.getByRole('alert').getAttribute('aria-describedby')).toBe('global-error-message')
    expect(screen.getByRole('main').style.backgroundColor).toBe('#09090b')
  })

  it('retries through the native keyboard-accessible button', () => {
    const onRetry = mock()

    render(<GlobalErrorPage onRetry={onRetry} />)
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
