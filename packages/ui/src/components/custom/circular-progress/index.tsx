import { LoaderCircle } from 'lucide-solid'
import { splitProps, type ComponentProps } from 'solid-js'
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

type CircularProgressProps = Omit<ComponentProps<'svg'>, 'color' | 'fill'> & {
  absoluteStrokeWidth?: boolean
  size?: CircularProgressSize
  color?: CircularProgressColor
  fill?: CircularProgressColor
  className?: string
}

const resolveSize = (size: CircularProgressSize) =>
  typeof size === 'number' ? size : DEFAULT_SIZES[size]

const resolveColor = (color: CircularProgressColor) =>
  DEFAULT_COLORS[color as keyof typeof DEFAULT_COLORS] ?? color

/**
 * Spinner for pending states.
 *
 * Decorative by default: the surrounding region is expected to carry the status
 * (see `route-loading`), so the SVG is hidden from the accessibility tree and a
 * caller that wants it announced can override via props. The spin is suppressed
 * under `prefers-reduced-motion`, which keeps the indicator visible while
 * removing the rotation.
 */
export function CircularProgress(props: CircularProgressProps) {
  const [local, others] = splitProps(props, [
    'absoluteStrokeWidth',
    'class',
    'className',
    'color',
    'fill',
    'size',
    'stroke-width',
  ])
  return (
    <LoaderCircle
      absoluteStrokeWidth={local.absoluteStrokeWidth ?? true}
      color={resolveColor(local.color ?? 'currentColor')}
      fill={resolveColor(local.fill ?? 'none')}
      size={resolveSize(local.size ?? 'xl')}
      stroke-width={local['stroke-width'] ?? 2.5}
      class={cn(
        'inline-block flex-shrink-0 animate-spin motion-reduce:animate-none',
        local.class,
        local.className
      )}
      aria-hidden="true"
      {...others}
    />
  )
}

export default CircularProgress
