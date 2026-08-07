'use client'
import { useMemo } from 'react'
import { cn } from '@nl/ui/utils'

import styles from './RentStepper.module.css'

const steps = ['Connect Wallet', 'Check Balance', 'Success']

export default function RentStepper({
  rentSuccess,
  checkBalance,
}: {
  rentSuccess: boolean
  checkBalance: boolean
}): React.ReactNode {
  const activeStep = useMemo(() => {
    if (rentSuccess) return 2
    if (checkBalance) return 1
    return 0
  }, [checkBalance, rentSuccess])

  return (
    <div>
      <div
        className="flex items-start"
        style={{ backgroundColor: 'transparent', marginBottom: 10 }}
      >
        {steps.map((label, index) => {
          const isActive = index === activeStep
          const isCompleted = index < activeStep
          const connectorDone = isCompleted || isActive
          return (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    styles.root,
                    isActive && styles.active,
                    isCompleted && styles.completed
                  )}
                />
                <span className="mt-2.5 text-xs text-foreground">{label}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    styles.alternativeLabel,
                    connectorDone && (isCompleted ? styles.completed : styles.active)
                  )}
                  style={{ flex: '1 1 0%' }}
                >
                  <div className={styles.line} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
