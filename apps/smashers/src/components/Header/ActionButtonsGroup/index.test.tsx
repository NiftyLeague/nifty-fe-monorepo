import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'
import type { ComponentProps } from 'react'

mock.module('next/image', () => ({
  default: ({
    alt,
    priority: _priority,
    ...props
  }: ComponentProps<'img'> & { priority?: boolean }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...props} />
  ),
}))

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
