import { clsx, type ClassValue } from 'clsx'

/**
 * Joins conditional class names without loading the heavier Tailwind conflict
 * resolver. Use this when the class list has no competing utility classes.
 */
export function cx(...inputs: ClassValue[]) {
  return clsx(inputs)
}
