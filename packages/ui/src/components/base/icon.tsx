import { forwardRef } from 'react'
import {
  Atom,
  Axe,
  Badge,
  Cat,
  Check,
  Circle,
  CircleAlert,
  CircleX,
  Copy,
  FlaskRound,
  Ghost,
  Key,
  Laugh,
  Link,
  Link2,
  Loader,
  LogOut,
  Mail,
  Medal,
  Minus,
  Panda,
  PiggyBank,
  Receipt,
  Save,
  ShieldCheck,
  SunDim,
  Trash,
  Upload,
  UserPen,
} from 'lucide-react'
import type { LucideIcon, LucideProps } from 'lucide-react'

type IconSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const DEFAULT_SIZES: Record<IconSizes, number> = { xs: 14, sm: 18, md: 20, lg: 24, xl: 28 }

const DEFAULT_COLORS: Record<string, string> = {
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
}

type IconColor = keyof typeof DEFAULT_COLORS

const iconMap = {
  atom: Atom,
  axe: Axe,
  badge: Badge,
  cat: Cat,
  check: Check,
  circle: Circle,
  'circle-alert': CircleAlert,
  'circle-x': CircleX,
  copy: Copy,
  'flask-round': FlaskRound,
  ghost: Ghost,
  key: Key,
  laugh: Laugh,
  link: Link,
  'link-2': Link2,
  loader: Loader,
  'log-out': LogOut,
  mail: Mail,
  minus: Minus,
  panda: Panda,
  'piggy-bank': PiggyBank,
  receipt: Receipt,
  medal: Medal,
  save: Save,
  'shield-check': ShieldCheck,
  'sun-dim': SunDim,
  trash: Trash,
  upload: Upload,
  'user-pen': UserPen,
} as const satisfies Record<string, LucideIcon>

type IconName = keyof typeof iconMap

interface IconProps extends Omit<LucideProps, 'size'> {
  name: IconName
  size?: IconSizes | number
  color?: IconColor | (string & {})
  fill?: IconColor | (string & {})
}

const Icon = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      absoluteStrokeWidth = true,
      color = 'currentColor',
      fill = 'none',
      name,
      size = 'md',
      strokeWidth = 1.5,
      ...props
    },
    ref
  ) => {
    const iconColor = DEFAULT_COLORS[color] || color
    const iconFill = DEFAULT_COLORS[fill] || fill
    const iconSize = typeof size === 'number' ? size : DEFAULT_SIZES[size]
    const IconComponent = iconMap[name]

    if (!IconComponent) {
      return <div style={{ width: iconSize, height: iconSize }} />
    }

    return (
      <IconComponent
        ref={ref}
        absoluteStrokeWidth={absoluteStrokeWidth}
        color={iconColor}
        fill={iconFill}
        size={iconSize}
        strokeWidth={strokeWidth}
        {...props}
      />
    )
  }
)

Icon.displayName = 'Icon'

export { Icon }
export type { IconColor, IconName, IconProps, IconSizes }
