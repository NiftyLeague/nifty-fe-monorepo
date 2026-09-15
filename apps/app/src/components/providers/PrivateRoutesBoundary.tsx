import dynamic from '@/runtime/dynamic'
import type { ParentProps } from 'solid-js'

import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import type { JSX } from 'solid-js'

interface PrivateRoutesBoundaryProps extends ParentProps {
  cookies?: string | null
}

export function PrivateRoutesLoading(): JSX.Element {
  return (
    <div
      class="flex min-h-screen flex-col gap-6 bg-background p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <DeferredSkeleton class="h-14 w-full rounded-lg" />
      <div class="flex min-h-0 flex-1 gap-6">
        <DeferredSkeleton class="hidden w-64 rounded-lg lg:block" />
        <DeferredSkeleton class="min-h-[24rem] flex-1 rounded-lg" />
      </div>
      <span class="sr-only">Loading private app</span>
    </div>
  )
}

const PrivateRoutesShell = dynamic(() => import('./PrivateRoutesShell'), {
  loading: PrivateRoutesLoading,
})

export default function PrivateRoutesBoundary(props: PrivateRoutesBoundaryProps) {
  return <PrivateRoutesShell cookies={props.cookies}>{props.children}</PrivateRoutesShell>
}
