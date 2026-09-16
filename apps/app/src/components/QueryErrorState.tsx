import { Button } from '@nl/ui/base/button'

type QueryErrorStateProps = {
  error: Error
  onRetry: () => void
  className?: string
}

export default function QueryErrorState(props: QueryErrorStateProps) {
  return (
    <div
      role="alert"
      class={props.className ?? 'flex min-h-48 items-center justify-center gap-3 text-error'}
    >
      <span>{props.error.message}</span>
      <Button type="button" variant="outline" onClick={props.onRetry}>
        Retry
      </Button>
    </div>
  )
}
