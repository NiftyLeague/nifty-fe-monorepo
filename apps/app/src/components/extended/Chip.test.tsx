import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { mock } from 'bun:test'

const mocks = {
  mode: 'light' as 'dark' | 'light',
  chip: mock(({ label }: { label?: React.ReactNode }) => <span>{label}</span>),
}

let Chip: typeof import('./Chip').default

beforeEach(async () => {
  mock.module('@nl/theme', () => ({ useTheme: () => ({ palette: { mode: mocks.mode } }) }))
  mock.module('@mui/material/Chip', () => ({ default: mocks.chip }))
  mocks.mode = 'light'
  mocks.chip.mockClear()
  Chip = (await import('./Chip')).default
})

afterEach(() => {
  mock.restore()
})

describe('Chip color variants', () => {
  it.each(['info', 'secondary', 'success', 'error', 'orange', 'warning'] as const)(
    'maps filled and outlined %s palettes',
    (colorType) => {
      const { rerender } = render(<Chip colorType={colorType} label={`${colorType} filled`} />)
      expect(screen.getByText(`${colorType} filled`)).not.toBeNull()
      expect(mocks.chip).toHaveBeenLastCalledWith(
        expect.objectContaining({ sx: expect.any(Object) }),
        undefined
      )

      mocks.mode = 'dark'
      rerender(<Chip colorType={colorType} label={`${colorType} outlined`} variant="outlined" />)
      expect(screen.getByText(`${colorType} outlined`)).not.toBeNull()
    }
  )

  it('applies disabled palettes and merges caller styles', () => {
    const { rerender } = render(<Chip disabled label="disabled filled" sx={{ opacity: 0.25 }} />)
    expect(mocks.chip).toHaveBeenLastCalledWith(
      expect.objectContaining({ sx: expect.objectContaining({ opacity: 0.25 }) }),
      undefined
    )

    rerender(<Chip disabled label="disabled outline" variant="outlined" />)
    expect(screen.getByText('disabled outline')).not.toBeNull()
  })
})
