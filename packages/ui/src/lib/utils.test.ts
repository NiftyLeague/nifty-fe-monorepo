import { describe, expect, it } from 'vitest';
import { cn, formatNumberToDisplay } from './utils';

describe('UI utility helpers', () => {
  it('merges conditional classes and resolves Tailwind conflicts', () => {
    const hidden = false;
    expect(cn('px-2', hidden && 'hidden', ['text-sm', 'px-4'])).toBe('text-sm px-4');
  });

  it('formats values consistently for display', () => {
    expect(formatNumberToDisplay()).toBe('0');
    expect(formatNumberToDisplay(1234.5)).toBe('1,234.50');
    expect(formatNumberToDisplay(12.3456, 3)).toBe('12.346');
  });
});
