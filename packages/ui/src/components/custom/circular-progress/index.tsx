'use client'

import { LoaderCircle, type LucideProps } from 'lucide-react'
import { cn } from '@nl/ui/utils'

type CircularProgressSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number

const DEFAULT_SIZES = { xs: 14, sm: 18, md: 20, lg: 24, xl: 28 } as const

const DEFAULT_COLORS = {
  foreground: 'var(--color-foreground)',
  dim: 'var(--color-muted-foreground)',
  dark: 'var(--color-dark)',
  light: 'var(--color-light)',
  error: 'var(--color-error)',
  warning: 'var(--color-warning)',
  success: 'var(--color-success)',
  info: 'var(--color-info)',
  blue: 'var(--color-blue)',
  purple: 'var(--color-purple)',
  gray: 'var(--color-base-500)',
} as const

type CircularProgressColor = keyof typeof DEFAULT_COLORS | (string & {})

type CircularProgressProps = Omit<LucideProps, 'size' | 'color' | 'fill'> & {
  size?: CircularProgressSize
  color?: CircularProgressColor
  fill?: CircularProgressColor
}

const resolveSize = (size: CircularProgressSize) =>
  typeof size === 'number' ? size : DEFAULT_SIZES[size]

const resolveColor = (color: CircularProgressColor) =>
  DEFAULT_COLORS[color as keyof typeof DEFAULT_COLORS] ?? color

export function CircularProgress({
  absoluteStrokeWidth = true,
  className = '',
  color = 'currentColor',
  fill = 'none',
  size = 'xl',
  strokeWidth = 2.5,
  ...props
}: CircularProgressProps) {
  return (
    <LoaderCircle
      absoluteStrokeWidth={absoluteStrokeWidth}
      color={resolveColor(color)}
      fill={resolveColor(fill)}
      size={resolveSize(size)}
      strokeWidth={strokeWidth}
      className={cn('inline-block flex-shrink-0 animate-spin', className)}
      aria-hidden="true"
      {...props}
    />
  )
}

export default CircularProgress
