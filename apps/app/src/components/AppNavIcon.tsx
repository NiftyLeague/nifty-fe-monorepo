import { NavIcon, type NavIconName, type NavIconProps } from '@nl/ui/custom/nav-icon'

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

type AppNavIconName = NavIconName
type AppNavIconSize = keyof typeof DEFAULT_SIZES
type AppNavIconColor = keyof typeof DEFAULT_COLORS | (string & {})

interface AppNavIconProps extends Omit<NavIconProps, 'color' | 'fill' | 'size' | 'name'> {
  absoluteStrokeWidth?: boolean
  name?: AppNavIconName
  size?: AppNavIconSize | number
  color?: AppNavIconColor
  fill?: AppNavIconColor
}

function AppNavIcon({
  absoluteStrokeWidth = true,
  color = 'currentColor',
  fill = 'none',
  name,
  size = 'md',
  strokeWidth = 1.5,
  className,
  ...props
}: AppNavIconProps) {
  const iconName = name ?? 'dot'
  const iconSize = typeof size === 'number' ? size : DEFAULT_SIZES[size]
  const iconColor = DEFAULT_COLORS[color as keyof typeof DEFAULT_COLORS] || color
  const iconFill = DEFAULT_COLORS[fill as keyof typeof DEFAULT_COLORS] || fill
  const iconClassName = ['lucide', `lucide-${iconName}`, className].filter(Boolean).join(' ')
  const numericStrokeWidth = typeof strokeWidth === 'number' ? strokeWidth : Number(strokeWidth)
  const resolvedStrokeWidth =
    absoluteStrokeWidth && Number.isFinite(numericStrokeWidth)
      ? (numericStrokeWidth * 24) / iconSize
      : strokeWidth

  return (
    <NavIcon
      name={iconName}
      className={iconClassName}
      color={iconColor}
      fill={iconFill}
      size={iconSize}
      strokeWidth={resolvedStrokeWidth}
      aria-hidden={props['aria-label'] ? undefined : 'true'}
      {...props}
    />
  )
}

export { AppNavIcon }
export type { AppNavIconColor, AppNavIconName, AppNavIconProps, AppNavIconSize }
