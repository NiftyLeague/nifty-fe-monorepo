import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'

interface RouteLoadingProps {
  label?: string
}

export function RouteLoading({ label = 'Loading page' }: RouteLoadingProps) {
  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-background px-4 text-foreground"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex w-full max-w-3xl flex-col gap-4">
        <DeferredSkeleton aria-hidden="true" className="h-8 w-48" />
        <DeferredSkeleton aria-hidden="true" className="h-64 w-full" />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  )
}

export default RouteLoading
