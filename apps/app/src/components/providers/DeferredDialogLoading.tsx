import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'

interface DeferredDialogLoadingProps {
  label: string
}

const DeferredDialogLoading = ({ label }: DeferredDialogLoadingProps): JSX.Element => (
  <div
    class="flex min-h-24 items-center justify-center p-4"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <DeferredSkeleton class="h-10 w-full max-w-sm" />
    <span class="sr-only">{label}</span>
  </div>
)

export default DeferredDialogLoading
