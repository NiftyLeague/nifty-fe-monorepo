import {
  Cat,
  ChevronDown,
  ChevronRight,
  Dot,
  Earth,
  Gamepad,
  House,
  LayoutGrid,
  ListOrdered,
  ListTree,
  Settings,
  Sparkles,
  Tally1,
  User,
} from 'lucide-solid'
import type { LucideIcon } from 'lucide-solid'
import { Dynamic } from 'solid-js/web'
import type { JSX } from 'solid-js'

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
  earth: Earth,
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

type AppNavIconProps = Omit<
  JSX.SvgSVGAttributes<SVGSVGElement>,
  'color' | 'fill' | 'width' | 'height'
> & {
  absoluteStrokeWidth?: boolean
  name?: AppNavIconName
  size?: AppNavIconSize | number
  color?: AppNavIconColor
  fill?: AppNavIconColor
  /** camelCase alias kept for call-site compatibility; maps to `stroke-width`. */
  strokeWidth?: number | string
}

function AppNavIcon(props: AppNavIconProps) {
  const rest = () => {
    const {
      absoluteStrokeWidth: _a,
      color: _c,
      fill: _f,
      name: _n,
      size: _s,
      strokeWidth: _w,
      ...restProps
    } = props
    return restProps
  }
  const icon = () => (props.name && iconMap[props.name]) || Dot
  const iconSize = () =>
    typeof props.size === 'number' ? props.size : DEFAULT_SIZES[props.size ?? 'md']
  const iconColor = () =>
    DEFAULT_COLORS[props.color as keyof typeof DEFAULT_COLORS] || props.color || 'currentColor'
  const iconFill = () =>
    DEFAULT_COLORS[props.fill as keyof typeof DEFAULT_COLORS] || props.fill || 'none'

  return (
    <Dynamic
      component={icon()}
      absoluteStrokeWidth={props.absoluteStrokeWidth ?? true}
      color={iconColor()}
      fill={iconFill()}
      size={iconSize()}
      stroke-width={props.strokeWidth ?? 1.5}
      aria-hidden={rest()['aria-label'] ? undefined : 'true'}
      {...rest()}
    />
  )
}

export { AppNavIcon }
export type { AppNavIconName }
