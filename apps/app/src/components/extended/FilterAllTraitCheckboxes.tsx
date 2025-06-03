import { FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';
import { TRAIT_VALUE_MAP } from '@/constants/cosmeticsFilters';
import { FilterSource } from '@/constants/filters';
import { ChangeEvent, Dispatch, FC, SetStateAction, memo } from 'react';

interface FilterAllTraitCheckboxesProps {
  cosmeticsValue: string[];
  traitGroup: string[];
  categoryKey: string;
  inputCheckBoxStyle: string;
  inputCheckFormControlStyle: string;
  setCosmeticsValue: Dispatch<SetStateAction<string[]>>;
  onCheckboxChange: (
    e: ChangeEvent<HTMLInputElement>,
    source: FilterSource,
    state: string[],
    setState: Dispatch<SetStateAction<string[]>>,
  ) => void;
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
  <FormGroup sx={{ flexDirection: 'row', rowGap: 0.5 }}>
    {traitGroup.map(traitKey => {
      const traitValue = TRAIT_VALUE_MAP[categoryKey as keyof typeof TRAIT_VALUE_MAP][
        traitKey as keyof (typeof TRAIT_VALUE_MAP)[keyof typeof TRAIT_VALUE_MAP]
      ] as string;
      return (
        <FormControlLabel
          key={traitKey}
          control={
            <Checkbox
              name={traitValue}
              value={traitKey}
              checked={cosmeticsValue.includes(traitKey)}
              className={inputCheckBoxStyle}
              onChange={e => onCheckboxChange(e, 'cosmetics', cosmeticsValue, setCosmeticsValue)}
            />
          }
          label={<Typography variant="body1">{traitValue}</Typography>}
          className={inputCheckFormControlStyle}
          sx={{ flex: '0 0 100%' }}
        />
      );
    })}
  </FormGroup>
);

// Making sure that the component is only re-rendered if the cosmesticsValue prop changes
// since this is component renders 900+ checkboxes, it matters here
export default memo(
  FilterAllTraitCheckboxes,
  (prevProps, nextProps) => prevProps.cosmeticsValue === nextProps.cosmeticsValue,
);
