import { createMemo, For, Show, type JSX } from 'solid-js'
import { cn } from '@nl/ui/utils'

import styles from './RentStepper.module.css'

const steps = ['Connect Wallet', 'Check Balance', 'Success']

export default function RentStepper(props: {
  rentSuccess: boolean
  checkBalance: boolean
}): JSX.Element {
  const activeStep = createMemo(() => {
    if (props.rentSuccess) return 2
    if (props.checkBalance) return 1
    return 0
  })

  return (
    <div>
      <div class="flex items-start bg-transparent mb-2.5">
        <For each={steps}>
          {(label, index) => {
            const isActive = () => index() === activeStep()
            const isCompleted = () => index() < activeStep()
            const connectorDone = () => isCompleted() || isActive()
            return (
              <div class="flex items-center">
                <div class="flex flex-col items-center">
                  <div
                    class={cn(
                      styles.root,
                      isActive() && styles.active,
                      isCompleted() && styles.completed
                    )}
                  />
                  <span class="mt-2.5 text-xs text-foreground">{label}</span>
                </div>
                <Show when={index() < steps.length - 1}>
                  <div
                    class={cn(
                      styles.alternativeLabel,
                      connectorDone() && (isCompleted() ? styles.completed : styles.active)
                    )}
                  >
                    <div class={styles.line} />
                  </div>
                </Show>
              </div>
            )
          }}
        </For>
      </div>
    </div>
  )
}
