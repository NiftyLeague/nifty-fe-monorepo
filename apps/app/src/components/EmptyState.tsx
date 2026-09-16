import { Button } from '@nl/ui/base/button'
import { Card } from '@nl/ui/base/card'
import type { JSX } from 'solid-js'

interface EmptyStateProps {
  message?: string
  buttonText?: string
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, Event>
  noBorder?: boolean
}
const EmptyState = (props: EmptyStateProps) => (
  <>
    <Card
      class={`mx-auto mt-5 w-[calc(100%_-_24px)] bg-transparent p-8 text-center shadow-none sm:w-100 ${
        props.noBorder ? 'border-none' : 'border-(--border-purple)'
      }`}
    >
      <p class="mt-2 text-foreground">{props.message}</p>
      {props.buttonText && (
        <Button variant="default" class="mt-2" onClick={props.onClick}>
          {props.buttonText}
        </Button>
      )}
    </Card>
  </>
)

export default EmptyState
