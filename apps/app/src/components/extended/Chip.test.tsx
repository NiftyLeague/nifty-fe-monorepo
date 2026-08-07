import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { mock } from 'bun:test'

let Chip: typeof import('./Chip').default

beforeEach(async () => {
  Chip = (await import('./Chip')).default
})

afterEach(() => {
  mock.restore()
})

describe('Chip color variants', () => {
  it.each(['info', 'secondary', 'success', 'error', 'orange', 'warning'] as const)(
    'renders filled and outlined %s variants',
    (colorType) => {
      const { rerender } = render(<Chip colorType={colorType} label={`${colorType} filled`} />)
      expect(screen.getByText(`${colorType} filled`)).not.toBeNull()

      rerender(<Chip colorType={colorType} label={`${colorType} outlined`} variant="outlined" />)
      expect(screen.getByText(`${colorType} outlined`)).not.toBeNull()
    }
  )

  it('applies disabled styles and merges caller styles', () => {
    const { rerender } = render(<Chip disabled label="disabled filled" sx={{ opacity: 0.25 }} />)
    const filled = screen.getByText('disabled filled')
    expect(filled).not.toBeNull()
    expect(filled.closest('span')?.style.opacity).toBe('0.25')

    rerender(<Chip disabled label="disabled outline" variant="outlined" />)
    expect(screen.getByText('disabled outline')).not.toBeNull()
  })
})
