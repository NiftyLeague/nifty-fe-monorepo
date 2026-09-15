import { fireEvent, render } from '@nl/ui/test-utils'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

const setTheme = mock()
const themeState = { resolvedTheme: 'light' as 'light' | 'dark' }

// Register the theme/lucide mocks inside beforeEach so they are scoped
// to this file and properly restored (top-level mock.module leaks across files).
beforeEach(() => {
  mock.module('@nl/ui/lib/theme', () => ({
    ThemeProvider: (props: { children?: import('solid-js').JSX.Element }) => (
      <div data-testid="theme-provider">{props.children}</div>
    ),
    useTheme: () => ({ setTheme, resolvedTheme: () => themeState.resolvedTheme }),
  }))
  setTheme.mockClear()
})

let ThemeProvider: typeof import('./index').ThemeProvider
let ThemeToggle: typeof import('./index').ThemeToggle

beforeEach(async () => {
  const mod = await import('./index')
  ThemeProvider = mod.ThemeProvider
  ThemeToggle = mod.ThemeToggle
})

describe('ThemeProvider', () => {
  it('renders children through the theme provider', () => {
    const { getByText } = render(() => (
      <ThemeProvider>
        <span>child</span>
      </ThemeProvider>
    ))
    expect(getByText('child')).toBeTruthy()
  })
})

describe('ThemeToggle', () => {
  it('shows the sun icon in light mode and switches to dark on click', () => {
    themeState.resolvedTheme = 'light'
    setTheme.mockClear()
    const { container } = render(() => <ThemeToggle />)
    expect(container.querySelector('svg.lucide-sun')).toBeTruthy()
    fireEvent.click(container.querySelector('button')!)
    expect(setTheme).toHaveBeenCalledWith('dark')
  })

  it('shows the moon icon in dark mode and switches to light on click', () => {
    themeState.resolvedTheme = 'dark'
    setTheme.mockClear()
    const { container } = render(() => <ThemeToggle />)
    expect(container.querySelector('svg.lucide-moon')).toBeTruthy()
    fireEvent.click(container.querySelector('button')!)
    expect(setTheme).toHaveBeenCalledWith('light')
  })
})
