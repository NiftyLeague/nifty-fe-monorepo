'use client'
import { createMemo } from 'solid-js'
import { cn } from '@nl/ui/utils'

import styles from './RentStepper.module.css'

const steps = ['Connect Wallet', 'Check Balance', 'Success']

export default function RentStepper({
  rentSuccess,
  checkBalance,
}: {
  rentSuccess: boolean
  checkBalance: boolean
}): JSX.Element {
  const activeStep = createMemo(() => {
    if (rentSuccess) return 2
    if (checkBalance) return 1
    return 0
  }, [checkBalance, rentSuccess])

  return (
    <div>
      <div
        class="flex items-start"
        style={{ 'background-color': 'transparent', 'margin-bottom': 10 }}
      >
        {steps.map((label, index) => {
          const isActive = index === activeStep
          const isCompleted = index < activeStep
          const connectorDone = isCompleted || isActive
          return (
            <div class="flex items-center">
              <div class="flex flex-col items-center">
                <div
                  class={cn(
                    styles.root,
                    isActive && styles.active,
                    isCompleted && styles.completed
                  )}
                />
                <span class="mt-2.5 text-xs text-foreground">{label}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  class={cn(
                    styles.alternativeLabel,
                    connectorDone && (isCompleted ? styles.completed : styles.active)
                  )}
                  style={{ flex: '1 1 0%' }}
                >
                  <div class={styles.line} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
