'use client'
import { useMemo } from 'react'

import { cn } from '@nl/ui/utils'
import { StepIconProps } from '@mui/material/StepIcon'
import Step from '@mui/material/Step'
import StepConnector from '@mui/material/StepConnector'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'

import styles from './RentStepper.module.css'

function ColorlibStepIcon({ active, completed }: StepIconProps) {
  return <div className={cn(styles.root, active && styles.active, completed && styles.completed)} />
}

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
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        style={{ backgroundColor: 'transparent', marginBottom: 10 }}
        connector={
          <StepConnector
            classes={{
              alternativeLabel: styles.alternativeLabel,
              active: styles.active,
              completed: styles.completed,
              line: styles.line,
            }}
          />
        }
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              sx={{ color: 'var(--color-foreground) !important' }}
              slots={{ stepIcon: ColorlibStepIcon }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  )
}
