import { lazy, type ParentComponent } from 'solid-js'
import { ErrorBoundary } from '@nl/ui/custom/error-boundry'

import type { TokenMenuProps } from './TokenMenu'

const TokenMenu = lazy(() => import('./TokenMenu'))

export const TokenMenuErrorBoundary: ParentComponent = (props) => (
  <ErrorBoundary>{props.children}</ErrorBoundary>
)

export default function TokenMenuBoundary(props: TokenMenuProps) {
  return (
    <TokenMenuErrorBoundary>
      <TokenMenu {...props} />
    </TokenMenuErrorBoundary>
  )
}
