import type { AppNavIconName } from '@/components/AppNavIcon'

// Local MUI-compatible minimal types (MUI support dropped)
export type Theme = {
  palette?: { mode?: 'light' | 'dark' }
  breakpoints?: {
    up: (key: string) => string
    down: (key: string) => string
    values?: Record<string, number>
  }
  spacing?: (...args: number[]) => string
}

export type SxProps<T = unknown> = React.CSSProperties | Record<string, unknown> | undefined

export interface GenericCardProps {
  title?: string
  primary?: string | number | undefined
  secondary?: string
  content?: string
  image?: string
  dateTime?: string
  color?: string
  size?: string
}

export type LinkTarget = '_blank' | '_self' | '_parent' | '_top'

export type NavItemTypeObject = { items: NavItemType[] }

export type NavItemType = {
  id?: string
  icon?: AppNavIconName
  target?: boolean
  external?: string
  url?: string | undefined
  type?: string
  title?: React.ReactNode | string
  color?: 'primary' | 'secondary' | 'default' | undefined
  caption?: React.ReactNode | string
  breadcrumbs?: boolean
  disabled?: boolean
  children?: NavItemType[]
}

export type GuardProps = { children: React.ReactNode }

export interface StringColorProps {
  id?: string
  label?: string
  color?: string
  primary?: string
  secondary?: string
}

/** ---- Common Functions types ---- */

export type StringBoolFunc = (s: string) => boolean
export type StringNumFunc = (s: string) => number
export type NumbColorFunc = (n: number, theme: Theme) => StringColorProps | undefined

export interface MenuItemBaseProps {
  value: string
  label: string
}
