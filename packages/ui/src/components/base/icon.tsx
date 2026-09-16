import { Show, splitProps, type ComponentProps } from 'solid-js'
import { Dynamic } from 'solid-js/web'
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
} from 'lucide-solid'
import type { LucideProps } from 'lucide-solid'

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
} as const satisfies Record<string, (props: LucideProps) => unknown>

type IconName = keyof typeof iconMap

type IconProps = Omit<ComponentProps<'svg'>, 'color' | 'fill'> & {
  absoluteStrokeWidth?: boolean
  /** Camel-case alias kept for the React-era API; mapped to `stroke-width`. */
  strokeWidth?: number
  name: IconName
  size?: IconSizes | number
  color?: IconColor | (string & {})
  fill?: IconColor | (string & {})
  className?: string
}

const Icon = (props: IconProps) => {
  const [local, others] = splitProps(props, [
    'absoluteStrokeWidth',
    'color',
    'fill',
    'name',
    'size',
    'strokeWidth',
    'class',
    'className',
  ])

  const iconColor = () => DEFAULT_COLORS[local.color ?? ''] || local.color || 'currentColor'
  const iconFill = () => DEFAULT_COLORS[local.fill ?? ''] || local.fill || 'none'
  const iconSize = () =>
    typeof local.size === 'number' ? local.size : DEFAULT_SIZES[local.size ?? 'md']

  return (
    <Show
      when={iconMap[local.name]}
      fallback={
        <div
          class="size-(--icon-size)"
          style={{ '--icon-size': `${iconSize()}px` }}
          aria-hidden="true"
        />
      }
    >
      {(IconComponent) => (
        <Dynamic
          component={IconComponent()}
          absoluteStrokeWidth={local.absoluteStrokeWidth ?? true}
          color={iconColor()}
          fill={iconFill()}
          size={iconSize()}
          strokeWidth={local.strokeWidth ?? 1.5}
          class={local.class ?? local.className}
          {...(others as LucideProps)}
          // A named icon is meaningful: give the svg the img role so the
          // accessible name is exposed (unnamed icons stay decorative).
          role={props.role ?? (props['aria-label'] || props['aria-labelledby'] ? 'img' : undefined)}
        />
      )}
    </Show>
  )
}

export { Icon }
export type { IconColor, IconName, IconProps, IconSizes }
