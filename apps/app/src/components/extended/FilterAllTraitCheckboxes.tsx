import { Checkbox } from '@nl/ui/base/checkbox'
import { TRAIT_VALUE_MAP } from '@/constants/cosmeticsFilters'
import { FC } from 'solid-js'

interface FilterAllTraitCheckboxesProps {
  cosmeticsValue: string[]
  traitGroup: string[]
  categoryKey: string
  inputCheckBoxStyle: string
  inputCheckFormControlStyle: string
  onCheckboxChange: (checked: boolean, value: string) => void
}

const FilterAllTraitCheckboxes: FC<FilterAllTraitCheckboxesProps> = ({
  cosmeticsValue,
  onCheckboxChange,
  traitGroup,
  categoryKey,
  inputCheckBoxStyle,
  inputCheckFormControlStyle,
}: FilterAllTraitCheckboxesProps) => (
  <div class="flex flex-row flex-wrap" style={{ rowGap: 4 }}>
    {traitGroup.map((traitKey) => {
      const traitValue = TRAIT_VALUE_MAP[categoryKey as keyof typeof TRAIT_VALUE_MAP][
        traitKey as keyof (typeof TRAIT_VALUE_MAP)[keyof typeof TRAIT_VALUE_MAP]
      ] as string
      return (
        <label          
          class={`${inputCheckFormControlStyle} flex items-center`}
          style={{ flex: '0 0 100%' }}
        >
          <Checkbox
            name={traitValue}
            value={traitKey}
            checked={cosmeticsValue.includes(traitKey)}
            class={inputCheckBoxStyle}
            onCheckedChange={(checked) => onCheckboxChange(checked === true, traitKey)}
          />
          <span class="text-base">{traitValue}</span>
        </label>
      )
    })}
  </div>
)

// Making sure that the component is only re-rendered if the cosmesticsValue prop changes
// since this is component renders 900+ checkboxes, it matters here
export default (
  FilterAllTraitCheckboxes,
  (prevProps, nextProps) => prevProps.cosmeticsValue === nextProps.cosmeticsValue
)
