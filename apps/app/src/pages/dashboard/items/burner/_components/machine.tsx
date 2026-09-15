'use client'

import { createSignal } from 'solid-js'
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
  const { address, burnDisabled, selectedComics } = props
  const [count, setCount] = createSignal<number>(0)

  useInterval(() => {
    setCount(count + 1)
  }, 500)

  return (
    <>
      <MachineFrame frames={['/img/comics/burner/machine/machine_main_3.webp']} />
      <MachineFrame frames={['/img/comics/burner/machine/fx_combined_02.gif']} />
      {!address ? (
        <MachineFrame
          frames={[
            '/img/comics/burner/machine/button_connectwallet_01.webp',
            '/img/comics/burner/machine/button_connectwallet_02.webp',
          ]}
          interval={count}
        />
      ) : null}
      <MachineFrame frames={['/img/comics/burner/machine/button_help_1.webp']} />
      {!burnDisabled ? (
        <MachineFrame
          frames={[
            '/img/comics/burner/machine/button_burn_1.webp',
            '/img/comics/burner/machine/button_burn_2.webp',
            '/img/comics/burner/machine/button_burn_3.webp',
            '/img/comics/burner/machine/button_burn_4.webp',
            '/img/comics/burner/machine/button_burn_5.webp',
          ]}
          interval={count}
        />
      ) : (
        <>
          {!address ? (
            <MachineFrame
              frames={['/img/comics/burner/machine/connectwalletabove_button_01.webp']}
            />
          ) : null}
          {selectedComics.length < 1 ? (
            <MachineFrame frames={['/img/comics/burner/machine/selectcomics_button_02.webp']} />
          ) : null}
          {address && selectedComics.length > 1 ? (
            <MachineFrame frames={['/img/comics/burner/machine/button_burn_gray_01.webp']} />
          ) : null}
        </>
      )}

      <MachineFrame frames={['/img/comics/burner/machine/button_q_1.webp']} />

    </>
  )
}

const ComicsBurnerMachineWithContext = ({
  burnDisabled = false,
  selectedComics = [],
}: {
  burnDisabled: boolean
  selectedComics: Comic[]
}) => {
  const { address } = useIMXContext()
  return (
    <ComicsBurnerMachine
      address={address}
      burnDisabled={burnDisabled}
      selectedComics={selectedComics}
    />
  )
}

export default ComicsBurnerMachineWithContext
