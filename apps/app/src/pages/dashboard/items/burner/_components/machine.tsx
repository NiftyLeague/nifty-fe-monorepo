import { Show, type JSX } from 'solid-js'
import useIMXContext from '@/hooks/useIMXContext'
import MachineFrame, { SpriteFrame } from './machine-frame'
import type { Comic } from '@/types/marketplace'

interface ComicsBurnerMachineProps {
  address?: `0x${string}`
  burnDisabled: boolean
  selectedComics: Comic[]
  children?: JSX.Element
}

const ComicsBurnerMachine = (props: ComicsBurnerMachineProps) => {
  return (
    <>
      <MachineFrame src="/img/comics/burner/machine/machine_main_3.webp" />
      <MachineFrame src="/img/comics/burner/machine/fx_combined_02.gif" />
      <Show when={!props.address}>
        <SpriteFrame
          sheet="/img/comics/burner/machine/button_connect_sheet.webp"
          frames={2}
          label="Connect wallet button"
        />
      </Show>
      <MachineFrame src="/img/comics/burner/machine/button_help_1.webp" />
      <Show
        when={props.burnDisabled}
        fallback={
          <SpriteFrame
            sheet="/img/comics/burner/machine/button_burn_sheet.webp"
            frames={5}
            label="Burn button"
          />
        }
      >
        <Show when={!props.address}>
          <MachineFrame src="/img/comics/burner/machine/connectwalletabove_button_01.webp" />
        </Show>
        <Show when={props.selectedComics.length < 1}>
          <MachineFrame src="/img/comics/burner/machine/selectcomics_button_02.webp" />
        </Show>
        <Show when={props.address && props.selectedComics.length > 1}>
          <MachineFrame src="/img/comics/burner/machine/button_burn_gray_01.webp" />
        </Show>
      </Show>

      <MachineFrame src="/img/comics/burner/machine/button_q_1.webp" />
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
