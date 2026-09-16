import type { JSX } from 'solid-js'
import type { AppNavIconName } from '@/components/AppNavIcon'

/** Solid-era equivalents of the React type helpers these interfaces used. */
export type SetStateAction<T> = T | ((previous: T) => T)
export type Dispatch<A> = (value: A) => void

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
  title?: JSX.Element | string
  color?: 'primary' | 'secondary' | 'default' | undefined
  caption?: JSX.Element | string
  breadcrumbs?: boolean
  disabled?: boolean
  children?: NavItemType[]
}

export type GuardProps = { children: JSX.Element }

export interface MenuItemBaseProps {
  value: string
  label: string
}
