import { Button } from '@nl/ui/base/button'

type QueryErrorStateProps = {
  error: unknown
  onRetry: () => void
  className?: string
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'An unexpected error occurred'
}

export default function QueryErrorState(props: QueryErrorStateProps) {
  return (
    <div
      role="alert"
      class={props.className ?? 'flex min-h-48 items-center justify-center gap-3 text-error'}
    >
      <span>{getErrorMessage(props.error)}</span>
      <Button type="button" variant="outline" onClick={props.onRetry}>
        Retry
      </Button>
    </div>
  )
}
