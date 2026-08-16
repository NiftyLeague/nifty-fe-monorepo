import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'bun:test'

describe('ActionButtonsGroup', () => {
  let ActionButtonsGroup: typeof import('./index').default

  beforeEach(async () => {
    ActionButtonsGroup = (await import('./index')).default
  })

  it('renders accessible themed actions without preloading modal content', () => {
    render(<ActionButtonsGroup activeModal={null} />)

    for (const label of ['Play', 'Trailer', 'Credits']) {
      const button = screen.getByRole('button', { name: label })

      expect(button.getAttribute('type')).toBe('button')
      expect(button.getAttribute('aria-busy')).toBe('false')
    }
  })
})
