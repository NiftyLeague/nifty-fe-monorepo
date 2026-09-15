'use client'

import { createMemo, For, Match, Show, Switch, type JSX } from 'solid-js'
import NativeImage from '@nl/ui/custom/native-image'
import { CheckCheck, ShieldCheck, UserRoundCheck } from 'lucide-solid'
import { cn } from '@nl/ui/utils'

import styles from './RenameStepper.module.css'

const StepIcon = (props: { icon: number; color: string }) => (
  <Switch>
    <Match when={props.icon === 1}>
      <NativeImage src="/img/logos/NFTL/logo.webp" alt="NFTL" width={30} height={30} />
    </Match>
    <Match when={props.icon === 2}>
      <ShieldCheck
        aria-hidden={true}
        color={props.color}
        size={28}
        stroke-width={2.5}
      />
    </Match>
    <Match when={props.icon === 3}>
      <UserRoundCheck
        aria-hidden={true}
        color={props.color}
        size={28}
        stroke-width={2.5}
      />
    </Match>
    <Match when={props.icon === 4}>
      <CheckCheck
        aria-hidden={true}
        color={props.color}
        size={28}
        stroke-width={2.5}
      />
    </Match>
  </Switch>
)

function ColorlibStepIcon(props: { active: boolean; completed: boolean; icon: number }) {
  return (
    <div class={cn(styles.root, props.active && styles.active, props.completed && styles.completed)}>
      <StepIcon
        icon={props.icon}
        color={props.active ? 'var(--color-light)' : 'var(--color-purple)'}
      />
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

function RenameStepper(props: {
  insufficientAllowance: boolean
  renameSuccess: boolean
  insufficientBalance: boolean
}): JSX.Element {
  const steps = getSteps()
  const activeStep = createMemo(() => {
    if (props.renameSuccess) return 3
    if (props.insufficientBalance) return 0
    return props.insufficientAllowance ? 1 : 2
  })

  return (
    <div>
      <div class="flex items-start justify-between">
        <For each={steps}>
          {(label, index) => (
            <div class="relative flex flex-1 flex-col items-center gap-2">
              <Show when={index() > 0}>
                <div class={cn(styles.line, styles.alternativeLabel)} />
              </Show>
              <ColorlibStepIcon
                active={activeStep() === index()}
                completed={activeStep() > index()}
                icon={index() + 1}
              />
              <div class="text-center text-sm text-foreground">{label}</div>
            </div>
          )}
        </For>
      </div>
      <em class="block text-center">
        <Show when={activeStep() !== steps.length}>
          <span
            class={cn(
              styles.styledTypography,
              activeStep() === 0
                ? 'text-error'
                : activeStep() === 1
                  ? 'text-warning'
                  : 'text-success'
            )}
          >
            {getStepContent(activeStep())}
          </span>
        </Show>
      </em>
    </div>
  )
}

export default RenameStepper
