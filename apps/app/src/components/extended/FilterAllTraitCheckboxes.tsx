import { For, type Component } from 'solid-js'
import { Checkbox } from '@nl/ui/base/checkbox'
import { TRAIT_VALUE_MAP } from '@/constants/cosmeticsFilters'

interface FilterAllTraitCheckboxesProps {
  cosmeticsValue: string[]
  traitGroup: string[]
  categoryKey: string
  inputCheckBoxStyle: string
  inputCheckFormControlStyle: string
  onCheckboxChange: (checked: boolean, value: string) => void
}

const FilterAllTraitCheckboxes: Component<FilterAllTraitCheckboxesProps> = (props) => (
  <div class="flex flex-row flex-wrap" style={{ 'row-gap': '4px' }}>
    <For each={props.traitGroup}>
      {(traitKey) => {
        const traitValue = TRAIT_VALUE_MAP[props.categoryKey as keyof typeof TRAIT_VALUE_MAP][
          traitKey as keyof (typeof TRAIT_VALUE_MAP)[keyof typeof TRAIT_VALUE_MAP]
        ] as string
        return (
          <label
            class={`${props.inputCheckFormControlStyle} flex items-center`}
            style={{ flex: '0 0 100%' }}
          >
            <Checkbox
              name={traitValue}
              value={traitKey}
              checked={props.cosmeticsValue.includes(traitKey)}
              class={props.inputCheckBoxStyle}
              onCheckedChange={(checked) => props.onCheckboxChange(checked === true, traitKey)}
            />
            <span class="text-base">{traitValue}</span>
          </label>
        )
      }}
    </For>
  </div>
)

export default FilterAllTraitCheckboxes
