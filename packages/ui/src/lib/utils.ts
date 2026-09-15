import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Kobalte's CloseButton defaults `aria-label` to the localized "Dismiss", which
 * overrides the accessible name of close controls that render their own text
 * label. Mirror a string child as the label so the accessible name stays the
 * visible text; icon-only closes keep an explicit `aria-label`.
 */
export function closeButtonAriaLabel(props: {
  'aria-label'?: string
  children?: unknown
}): string | undefined {
  return props['aria-label'] ?? (typeof props.children === 'string' ? props.children : undefined)
}
