import { Button } from '@nl/ui/base/button'
import { Card } from '@nl/ui/base/card'

interface EmptyStateProps {
  message?: string
  buttonText?: string
  onClick?: JSX.EventHandler<HTMLButtonElement>
  noBorder?: boolean
}
const EmptyState = ({ message, buttonText, onClick, noBorder = false }: EmptyStateProps) => (
  <>
    <Card
      class={`mx-auto mt-5 w-[calc(100%_-_24px)] bg-transparent p-8 text-center shadow-none sm:w-[400px] ${
        noBorder ? 'border-none' : 'border-[var(--border-purple)]'
      }`}
    >
      <p class="mt-2 text-foreground">{message}</p>
      {buttonText && (
        <Button variant="default" class="mt-2" onClick={onClick}>
          {buttonText}
        </Button>
      )}
    </Card>
  </>
)

export default EmptyState
