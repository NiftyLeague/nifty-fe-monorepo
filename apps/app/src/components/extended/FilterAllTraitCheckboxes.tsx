import { Checkbox } from '@nl/ui/base/checkbox'
import { TRAIT_VALUE_MAP } from '@/constants/cosmeticsFilters'
import { FilterSource } from '@/constants/filters'
import { ChangeEvent, Dispatch, FC, SetStateAction, memo } from 'react'

interface FilterAllTraitCheckboxesProps {
  cosmeticsValue: string[]
  traitGroup: string[]
  categoryKey: string
  inputCheckBoxStyle: string
  inputCheckFormControlStyle: string
  setCosmeticsValue: Dispatch<SetStateAction<string[]>>
  onCheckboxChange: (
    e: ChangeEvent<HTMLInputElement>,
    source: FilterSource,
    state: string[],
    setState: Dispatch<SetStateAction<string[]>>
  ) => void
}

const FilterAllTraitCheckboxes: FC<FilterAllTraitCheckboxesProps> = ({
  cosmeticsValue,
  onCheckboxChange,
  setCosmeticsValue,
  traitGroup,
  categoryKey,
  inputCheckBoxStyle,
  inputCheckFormControlStyle,
}: FilterAllTraitCheckboxesProps) => (
  <div className="flex flex-row flex-wrap" style={{ rowGap: 4 }}>
    {traitGroup.map((traitKey) => {
      const traitValue = TRAIT_VALUE_MAP[categoryKey as keyof typeof TRAIT_VALUE_MAP][
        traitKey as keyof (typeof TRAIT_VALUE_MAP)[keyof typeof TRAIT_VALUE_MAP]
      ] as string
      return (
        <label
          key={traitKey}
          className={`${inputCheckFormControlStyle} flex items-center`}
          style={{ flex: '0 0 100%' }}
        >
          <Checkbox
            name={traitValue}
            value={traitKey}
            checked={cosmeticsValue.includes(traitKey)}
            className={inputCheckBoxStyle}
            onCheckedChange={(checked) =>
              onCheckboxChange(
                {
                  target: { checked: checked === true, value: traitKey },
                } as ChangeEvent<HTMLInputElement>,
                'cosmetics',
                cosmeticsValue,
                setCosmeticsValue
              )
            }
          />
          <span className="text-base">{traitValue}</span>
        </label>
      )
    })}
  </div>
)

// Making sure that the component is only re-rendered if the cosmesticsValue prop changes
// since this is component renders 900+ checkboxes, it matters here
export default memo(
  FilterAllTraitCheckboxes,
  (prevProps, nextProps) => prevProps.cosmeticsValue === nextProps.cosmeticsValue
)
