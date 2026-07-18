import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

const setTheme = mock();
const themeState = { resolvedTheme: 'light' as string };

mock.module('next-themes', () => ({
  ThemeProvider: ({ children }: { children?: React.ReactNode }) => <div data-testid="next-themes">{children}</div>,
  useTheme: () => ({ setTheme, resolvedTheme: themeState.resolvedTheme }),
}));

mock.module('lucide-react/dynamic', () => ({ DynamicIcon: ({ name }: { name: string }) => <svg aria-label={name} /> }));

import { ThemeProvider, ThemeToggle } from './index';

describe('ThemeProvider', () => {
  it('renders children through next-themes provider', () => {
    const { getByText } = render(
      <ThemeProvider>
        <span>child</span>
      </ThemeProvider>,
    );
    expect(getByText('child')).toBeTruthy();
  });
});

describe('ThemeToggle', () => {
  it('shows the sun icon in light mode and switches to dark on click', () => {
    themeState.resolvedTheme = 'light';
    setTheme.mockClear();
    const { container } = render(<ThemeToggle />);
    expect(container.querySelector('svg[aria-label="sun"]')).toBeTruthy();
    fireEvent.click(container.querySelector('button')!);
    expect(setTheme).toHaveBeenCalledWith('dark');
  });

  it('shows the moon icon in dark mode and switches to light on click', () => {
    themeState.resolvedTheme = 'dark';
    setTheme.mockClear();
    const { container } = render(<ThemeToggle />);
    expect(container.querySelector('svg[aria-label="moon"]')).toBeTruthy();
    fireEvent.click(container.querySelector('button')!);
    expect(setTheme).toHaveBeenCalledWith('light');
  });
});
