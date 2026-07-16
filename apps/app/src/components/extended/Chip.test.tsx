import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Chip from './Chip';

const mocks = vi.hoisted(() => ({
  mode: 'light' as 'dark' | 'light',
  chip: vi.fn(({ label }: { label?: React.ReactNode }) => <span>{label}</span>),
}));

vi.mock('@nl/theme', () => ({ useTheme: () => ({ palette: { mode: mocks.mode } }) }));
vi.mock('@mui/material/Chip', () => ({ default: mocks.chip }));

afterEach(() => {
  mocks.mode = 'light';
  mocks.chip.mockClear();
});

describe('Chip color variants', () => {
  it.each(['info', 'secondary', 'success', 'error', 'orange', 'warning'] as const)(
    'maps filled and outlined %s palettes',
    colorType => {
      const { rerender } = render(<Chip colorType={colorType} label={`${colorType} filled`} />);
      expect(screen.getByText(`${colorType} filled`)).toBeInTheDocument();
      expect(mocks.chip).toHaveBeenLastCalledWith(expect.objectContaining({ sx: expect.any(Object) }), undefined);

      mocks.mode = 'dark';
      rerender(<Chip colorType={colorType} label={`${colorType} outlined`} variant="outlined" />);
      expect(screen.getByText(`${colorType} outlined`)).toBeInTheDocument();
    },
  );

  it('applies disabled palettes and merges caller styles', () => {
    const { rerender } = render(<Chip disabled label="disabled filled" sx={{ opacity: 0.25 }} />);
    expect(mocks.chip).toHaveBeenLastCalledWith(
      expect.objectContaining({ sx: expect.objectContaining({ opacity: 0.25 }) }),
      undefined,
    );

    rerender(<Chip disabled label="disabled outline" variant="outlined" />);
    expect(screen.getByText('disabled outline')).toBeInTheDocument();
  });
});
