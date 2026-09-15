import { createMemo, For, type JSX } from 'solid-js'

import { useGamerProfileContext } from '@/hooks/useGamerProfile'
import Item from './Item'

interface RightInfoProps {
  comicCount: number
  degenCount: number
  itemCount: number
  keyCount: number
  rentalCount: number
}
const RightInfo = (props: RightInfoProps): JSX.Element => {
  const profile = useGamerProfileContext()
  const rightDataMapper = createMemo(
    (): {
      label: string
      value: string | number | undefined
      isLoading?: boolean
      isDisable?: boolean
    }[] => {
      return [
        { label: 'Degens Owned', value: props.degenCount, isLoading: profile.isLoadingDegens },
        // {
        //   label: 'Degens Rented',
        //   value: props.rentalCount,
        //   isLoading: profile.isLoadingDegens,
        // },
        { label: 'Comics Owned', value: props.comicCount, isLoading: profile.isLoadingComics },
        { label: 'Items Owned', value: props.itemCount, isLoading: profile.isLoadingItems },
        { label: 'Keys Owned', value: props.keyCount, isLoading: profile.isLoadingItems },
        // {
        //   label: 'Pets Owned',
        //   ...commonValue,
        // },
        // {
        //   label: 'Land Owned',
        //   ...commonValue,
        // },
        // {
        //   label: 'Land Items Owned',
        //   ...commonValue,
        // },
      ]
    }
  )

  return (
    <div class="flex flex-1 flex-col gap-2">
      <For each={rightDataMapper()}>{(child) => <Item {...child} />}</For>
    </div>
  )
}

export default RightInfo
