import Preloader from '@nl/ui/custom/preloader'

interface RouteLoadingProps {
  label?: string
}

export function RouteLoading(props: RouteLoadingProps) {
  return (
    <div class="relative flex min-h-[calc(100dvh-96px)] w-full items-center justify-center overflow-hidden bg-background px-4 text-foreground lg:min-h-[calc(100dvh-120px)]">
      <Preloader ready={false} progress={0} label={props.label ?? 'Loading page'} />
    </div>
  )
}

export default RouteLoading
