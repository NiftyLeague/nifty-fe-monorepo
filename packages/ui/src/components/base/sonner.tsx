import { Toaster as Sonner, type ToasterProps } from 'solid-sonner'

import { useTheme } from '@nl/ui/lib/theme'

const Toaster = (props: ToasterProps) => {
  const { resolvedTheme } = useTheme()

  return (
    <Sonner
      theme={resolvedTheme()}
      class="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as Record<string, string>
      }
      {...props}
    />
  )
}

export { Toaster }
export { toast } from 'solid-sonner'
