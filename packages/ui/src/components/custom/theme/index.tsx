import { Moon, Sun } from 'lucide-solid'

import { Button } from '@nl/ui/base/button'
import { ThemeProvider, useTheme } from '@nl/ui/lib/theme'

export { ThemeProvider }

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(resolvedTheme() === 'dark' ? 'light' : 'dark')}
    >
      {resolvedTheme() === 'dark' ? (
        <Moon absoluteStrokeWidth class="h-[1.2rem] w-[1.2rem]" size={20} strokeWidth={1.5} />
      ) : (
        <Sun absoluteStrokeWidth class="h-[1.2rem] w-[1.2rem]" size={20} strokeWidth={1.5} />
      )}
      <span class="sr-only">Toggle theme</span>
    </Button>
  )
}
