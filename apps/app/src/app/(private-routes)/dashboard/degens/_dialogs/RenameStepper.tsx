'use client'

import { cloneElement, useMemo, type ReactElement } from 'react'
import Image from 'next/image'
import { cn } from '@nl/ui/utils'

import { StepIconProps } from '@mui/material/StepIcon'
import Step from '@mui/material/Step'
import StepConnector from '@mui/material/StepConnector'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'

import { Icon, type IconProps } from '@nl/ui/base/icon'

import styles from './RenameStepper.module.css'

const icons: { [index: string]: React.ReactElement } = {
  1: <Image src="/img/logos/NFTL/logo.webp" alt="NFTL" width={30} height={30} />,
  2: <Icon name="shield-check" size="xl" strokeWidth={2.5} />,
  3: <Icon name="user-round-check" size="xl" strokeWidth={2.5} />,
  4: <Icon name="check-check" size="xl" strokeWidth={2.5} />,
}

function ColorlibStepIcon({ active, completed, icon }: StepIconProps) {
  return (
    <div className={cn(styles.root, active && styles.active, completed && styles.completed)}>
      {(() => {
        const iconElement = icons[String(icon)] as unknown as ReactElement<IconProps>
        return iconElement
          ? cloneElement(iconElement, { color: active ? 'light' : 'purple' })
          : null
      })()}
    </div>
  )
}

function getSteps() {
  return [
    'Obtain 1000 NFTL',
    'Approve contract as NFTL spender',
    'Submit rename request',
    'DEGEN Renamed!',
  ]
}

function getStepContent(step: number) {
  switch (step) {
    case 0: {
      return '1000 NFTL required to rename. Please either claim NFTL from your degen or use Uniswap to purchase.'
    }
    case 1:
      return 'Note: renaming requires two transactions since the Nifty Degen contract is not already an approved spender.'
    case 2:
      return 'Spender approved, submit rename request'
    default:
      return ''
  }
}

function RenameStepper({
  insufficientAllowance,
  renameSuccess,
  insufficientBalance,
}: {
  insufficientAllowance: boolean
  renameSuccess: boolean
  insufficientBalance: boolean
}): React.ReactNode {
  const steps = getSteps()
  const activeStep = useMemo(() => {
    if (renameSuccess) return 3
    if (insufficientBalance) return 0
    return insufficientAllowance ? 1 : 2
  }, [insufficientAllowance, insufficientBalance, renameSuccess])

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
      <em style={{ textAlign: 'center' }}>
        {activeStep !== steps.length ? (
          <Typography
            className={cn(
              styles.styledTypography,
              activeStep === 0 ? 'text-error' : activeStep === 1 ? 'text-warning' : 'text-success'
            )}
          >
            {getStepContent(activeStep)}
          </Typography>
        ) : null}
      </em>
    </div>
  )
}

export default RenameStepper
