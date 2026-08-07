'use client'

import { cloneElement, useMemo, type ReactElement } from 'react'
import Image from 'next/image'
import { cn } from '@nl/ui/utils'

import { Icon, type IconProps } from '@nl/ui/base/icon'

import styles from './RenameStepper.module.css'

const icons: { [index: string]: React.ReactElement } = {
  1: <Image src="/img/logos/NFTL/logo.webp" alt="NFTL" width={30} height={30} />,
  2: <Icon name="shield-check" size="xl" strokeWidth={2.5} />,
  3: <Icon name="user-round-check" size="xl" strokeWidth={2.5} />,
  4: <Icon name="check-check" size="xl" strokeWidth={2.5} />,
}

function ColorlibStepIcon({
  active,
  completed,
  icon,
}: {
  active: boolean
  completed: boolean
  icon: number
}) {
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
      <div className="flex items-start justify-between">
        {steps.map((label, index) => (
          <div key={label} className="relative flex flex-1 flex-col items-center gap-2">
            {index > 0 && <div className={cn(styles.line, styles.alternativeLabel)} />}
            <ColorlibStepIcon
              active={activeStep === index}
              completed={activeStep > index}
              icon={index + 1}
            />
            <div className="text-center text-sm text-foreground">{label}</div>
          </div>
        ))}
      </div>
      <em className="block text-center">
        {activeStep !== steps.length ? (
          <span
            className={cn(
              styles.styledTypography,
              activeStep === 0 ? 'text-error' : activeStep === 1 ? 'text-warning' : 'text-success'
            )}
          >
            {getStepContent(activeStep)}
          </span>
        ) : null}
      </em>
    </div>
  )
}

export default RenameStepper
