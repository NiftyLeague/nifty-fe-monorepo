import type { JSX } from 'solid-js'
import PublicNavigation from '@/components/providers/PublicNavigation'

export default function PublicMainLayout(props: { children?: JSX.Element }) {
  return <PublicNavigation>{props.children}</PublicNavigation>
}
