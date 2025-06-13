import { Slider, SliderProps, Stack, Typography } from '@mui/material';
import { memo } from 'react';

interface Props extends Omit<SliderProps, 'value'> {
  value: number[];
  unit?: string;
  label?: string;
}

const FilterRangeSlider = ({ value, unit, ...props }: Props): React.ReactNode => (
  <Stack>
    <Stack gap={0.5}>
      <Typography variant="h6">{`${(value[0] as number).toLocaleString()} - ${(value[1] as number).toLocaleString()} ${
        unit || ''
      }`}</Typography>
      <Slider
        {...props}
        value={value}
        sx={{
          ml: 1,
          width: 'calc(100% - 16px)',
          '& .MuiSlider-thumb': { background: 'var(--color-purple)', border: 'var(--border-purple)' },
        }}
      />
    </Stack>
  </Stack>
);

export default memo(FilterRangeSlider, (prevProps, nextProps) => prevProps.value === nextProps.value);
