import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  useContext,
  type Accessor,
  type JSX,
} from 'solid-js'

export type Theme = 'light' | 'dark' | 'system'

type ThemeContextValue = {
  theme: Accessor<Theme>
  resolvedTheme: Accessor<'light' | 'dark'>
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>()

const STORAGE_KEY = 'theme'

const systemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

const applyTheme = (resolved: 'light' | 'dark') => {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(resolved)
  root.style.colorScheme = resolved
}

/**
 * Minimal Solid replacement for the bits of next-themes this library used:
 * `attribute="class"`, `defaultTheme="system"`, `enableSystem`, and
 * `disableTransitionOnChange` are now the fixed behavior rather than options.
 */
export function ThemeProvider(props: { children?: JSX.Element }) {
  const [theme, setThemeState] = createSignal<Theme>(
    typeof window === 'undefined'
      ? 'system'
      : ((window.localStorage.getItem(STORAGE_KEY) as Theme | null) ?? 'system')
  )

  const resolvedTheme = createMemo<'light' | 'dark'>(() =>
    theme() === 'system' ? systemTheme() : (theme() as 'light' | 'dark')
  )

  const setTheme = (next: Theme) => {
    window.localStorage.setItem(STORAGE_KEY, next)
    setThemeState(next)
  }

  createEffect(() => {
    applyTheme(resolvedTheme())

    if (theme() !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme(systemTheme())
    media.addEventListener('change', onChange)
    onCleanup(() => media.removeEventListener('change', onChange))
  })

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {props.children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (context) return context

  // Outside a provider, resolve passively so toast styling still tracks the
  // document class instead of throwing.
  const resolved = createMemo<'light' | 'dark'>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light'
  )
  return {
    theme: () => 'system',
    resolvedTheme: resolved,
    setTheme: () => undefined,
  }
}
