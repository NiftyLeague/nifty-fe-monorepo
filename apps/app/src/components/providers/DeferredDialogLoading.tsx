import { Skeleton } from '@nl/ui/base/skeleton'

interface DeferredDialogLoadingProps {
  label: string
}

const DeferredDialogLoading = ({ label }: DeferredDialogLoadingProps): React.ReactNode => (
  <div
    className="flex min-h-24 items-center justify-center p-4"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <Skeleton className="h-10 w-full max-w-sm" />
    <span className="sr-only">{label}</span>
  </div>
)

export default DeferredDialogLoading
