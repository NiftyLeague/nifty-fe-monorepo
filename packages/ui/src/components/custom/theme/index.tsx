'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

import { Button } from '@nl/ui/base/button'

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

export function ThemeToggle() {
  const { setTheme, resolvedTheme: theme } = useTheme()
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <Moon absoluteStrokeWidth className="h-[1.2rem] w-[1.2rem]" size={20} strokeWidth={1.5} />
      ) : (
        <Sun absoluteStrokeWidth className="h-[1.2rem] w-[1.2rem]" size={20} strokeWidth={1.5} />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
