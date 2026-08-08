'use client'

import { forwardRef } from 'react'
import {
  AlertCircle,
  ArrowDown,
  Atom,
  Axe,
  Badge,
  BookHeart,
  BookOpenCheck,
  Cat,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  CircleAlert,
  CircleArrowLeft,
  CircleX,
  Copy,
  Database,
  Dot,
  Download,
  Edit,
  ExternalLink,
  FlaskRound,
  Flame,
  Gamepad,
  Ghost,
  Grid3x3,
  Heart,
  House,
  Inbox,
  Info,
  Key,
  KeyRound,
  Laugh,
  LayoutGrid,
  Link,
  Link2,
  ListOrdered,
  ListTree,
  Loader,
  LoaderCircle,
  Lock,
  LogOut,
  Mail,
  Maximize2,
  Medal,
  Menu,
  Minus,
  Moon,
  Panda,
  Pencil,
  PiggyBank,
  Plus,
  Receipt,
  Save,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Sun,
  SunDim,
  Tally1,
  Trash,
  TriangleAlert,
  Upload,
  User,
  UserPen,
  UserRoundCheck,
  X,
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
  'alert-circle': AlertCircle,
  'arrow-down': ArrowDown,
  atom: Atom,
  axe: Axe,
  badge: Badge,
  'book-heart': BookHeart,
  'book-open-check': BookOpenCheck,
  cat: Cat,
  check: Check,
  'check-check': CheckCheck,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  circle: Circle,
  'circle-alert': CircleAlert,
  'circle-arrow-left': CircleArrowLeft,
  'circle-x': CircleX,
  copy: Copy,
  database: Database,
  dot: Dot,
  download: Download,
  edit: Edit,
  'external-link': ExternalLink,
  flame: Flame,
  'flask-round': FlaskRound,
  gamepad: Gamepad,
  ghost: Ghost,
  'grid-3x3': Grid3x3,
  heart: Heart,
  house: House,
  inbox: Inbox,
  info: Info,
  key: Key,
  'key-round': KeyRound,
  laugh: Laugh,
  'layout-grid': LayoutGrid,
  link: Link,
  'link-2': Link2,
  'list-ordered': ListOrdered,
  'list-tree': ListTree,
  loader: Loader,
  'loader-circle': LoaderCircle,
  lock: Lock,
  'log-out': LogOut,
  mail: Mail,
  'maximize-2': Maximize2,
  medal: Medal,
  menu: Menu,
  minus: Minus,
  moon: Moon,
  panda: Panda,
  pencil: Pencil,
  'piggy-bank': PiggyBank,
  plus: Plus,
  receipt: Receipt,
  save: Save,
  settings: Settings,
  'shield-check': ShieldCheck,
  'shopping-cart': ShoppingCart,
  sparkles: Sparkles,
  sun: Sun,
  'sun-dim': SunDim,
  'tally-1': Tally1,
  trash: Trash,
  'triangle-alert': TriangleAlert,
  upload: Upload,
  user: User,
  'user-pen': UserPen,
  'user-round-check': UserRoundCheck,
  x: X,
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
