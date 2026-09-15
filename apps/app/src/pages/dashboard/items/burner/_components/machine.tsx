'use client'

import { createSignal, Show, type JSX } from 'solid-js'
import useInterval from '@/hooks/useInterval'
import useIMXContext from '@/hooks/useIMXContext'
import MachineFrame from './machine-frame'
import type { Comic } from '@/types/marketplace'

interface ComicsBurnerMachineProps {
  address?: `0x${string}`
  burnDisabled: boolean
  selectedComics: Comic[]
  children?: JSX.Element
}

const ComicsBurnerMachine = (props: ComicsBurnerMachineProps) => {
  const [count, setCount] = createSignal<number>(0)

  useInterval(() => {
    setCount(count() + 1)
  }, 500)

  return (
    <>
      <MachineFrame frames={['/img/comics/burner/machine/machine_main_3.webp']} />
      <MachineFrame frames={['/img/comics/burner/machine/fx_combined_02.gif']} />
      <Show when={!props.address}>
        <MachineFrame
          frames={[
            '/img/comics/burner/machine/button_connectwallet_01.webp',
            '/img/comics/burner/machine/button_connectwallet_02.webp',
          ]}
          interval={count()}
        />
      </Show>
      <MachineFrame frames={['/img/comics/burner/machine/button_help_1.webp']} />
      <Show
        when={props.burnDisabled}
        fallback={
          <MachineFrame
            frames={[
              '/img/comics/burner/machine/button_burn_1.webp',
              '/img/comics/burner/machine/button_burn_2.webp',
              '/img/comics/burner/machine/button_burn_3.webp',
              '/img/comics/burner/machine/button_burn_4.webp',
              '/img/comics/burner/machine/button_burn_5.webp',
            ]}
            interval={count()}
          />
        }
      >
        <Show when={!props.address}>
          <MachineFrame
            frames={['/img/comics/burner/machine/connectwalletabove_button_01.webp']}
          />
        </Show>
        <Show when={props.selectedComics.length < 1}>
          <MachineFrame frames={['/img/comics/burner/machine/selectcomics_button_02.webp']} />
        </Show>
        <Show when={props.address && props.selectedComics.length > 1}>
          <MachineFrame frames={['/img/comics/burner/machine/button_burn_gray_01.webp']} />
        </Show>
      </Show>

      <MachineFrame frames={['/img/comics/burner/machine/button_q_1.webp']} />
    </>
  )
}

const ComicsBurnerMachineWithContext = (props: {
  burnDisabled: boolean
  selectedComics: Comic[]
}) => {
  const imx = useIMXContext()
  return (
    <ComicsBurnerMachine
      address={imx.address}
      burnDisabled={props.burnDisabled ?? false}
      selectedComics={props.selectedComics ?? []}
    />
  )
}

export default ComicsBurnerMachineWithContext
