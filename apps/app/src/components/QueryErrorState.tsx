import { Button } from '@nl/ui/base/button'

type QueryErrorStateProps = {
  error: Error
  onRetry: () => void
  className?: string
}

export default function QueryErrorState({ error, onRetry, className }: QueryErrorStateProps) {
  return (
    <div
      role="alert"
      className={className ?? 'flex min-h-48 items-center justify-center gap-3 text-error'}
    >
      <span>{error.message}</span>
      <Button type="button" variant="outline" onClick={onRetry}>
        Retry
      </Button>
    </div>
  )
}
