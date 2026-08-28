import {
  Cat,
  ChevronDown,
  ChevronRight,
  Dot,
  Gamepad,
  House,
  LayoutGrid,
  ListOrdered,
  ListTree,
  Settings,
  Sparkles,
  Tally1,
  User,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { SVGProps } from 'react'

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

const iconMap = {
  cat: Cat,
  'chevron-down': ChevronDown,
  'chevron-right': ChevronRight,
  dot: Dot,
  gamepad: Gamepad,
  house: House,
  'layout-grid': LayoutGrid,
  'list-ordered': ListOrdered,
  'list-tree': ListTree,
  settings: Settings,
  sparkles: Sparkles,
  'tally-1': Tally1,
  user: User,
} as const satisfies Record<string, LucideIcon>

type AppNavIconName = keyof typeof iconMap
type AppNavIconSize = keyof typeof DEFAULT_SIZES
type AppNavIconColor = keyof typeof DEFAULT_COLORS | (string & {})

type AppNavIconProps = Omit<SVGProps<SVGSVGElement>, 'color' | 'fill' | 'width' | 'height'> & {
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
  ...props
}: AppNavIconProps) {
  const IconComponent = (name && iconMap[name]) || Dot
  const iconSize = typeof size === 'number' ? size : DEFAULT_SIZES[size]
  const iconColor = DEFAULT_COLORS[color as keyof typeof DEFAULT_COLORS] || color
  const iconFill = DEFAULT_COLORS[fill as keyof typeof DEFAULT_COLORS] || fill

  return (
    <IconComponent
      absoluteStrokeWidth={absoluteStrokeWidth}
      color={iconColor}
      fill={iconFill}
      size={iconSize}
      strokeWidth={strokeWidth}
      aria-hidden={props['aria-label'] ? undefined : 'true'}
      {...props}
    />
  )
}

export { AppNavIcon }
export type { AppNavIconName }
