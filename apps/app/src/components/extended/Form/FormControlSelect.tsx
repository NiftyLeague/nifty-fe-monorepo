'use client';

import { useState } from 'react';

// material-ui
import { useTheme } from '@nl/theme';
import { Divider, FormControl, InputAdornment, MenuItem, TextField } from '@mui/material';

// project imports
import type { GenericCardProps } from '@/types';

// ==============================|| FORM CONTROL SELECT ||============================== //

interface FormControlSelectProps {
  captionLabel?: string;
  currencies?: { value: string; label: string }[];
  formState?: string;
  iconPrimary?: GenericCardProps['iconPrimary'];
  iconSecondary?: GenericCardProps['iconPrimary'];
  selected?: string;
  textPrimary?: string;
  textSecondary?: string;
}

const FormControlSelect = ({
  captionLabel,
  currencies,
  formState,
  iconPrimary,
  iconSecondary,
  selected,
  textPrimary,
  textSecondary,
}: FormControlSelectProps) => {
  const theme = useTheme();
  const IconPrimary = iconPrimary!;
  const primaryIcon = iconPrimary ? <IconPrimary fontSize="small" sx={{ color: theme.palette.grey[700] }} /> : null;

  const IconSecondary = iconSecondary!;
  const secondaryIcon = iconSecondary ? (
    <IconSecondary fontSize="small" sx={{ color: theme.palette.grey[700] }} />
  ) : null;

  const errorState = formState === 'error';
  const val = selected || '';

  const [currency, setCurrency] = useState(val);
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
    event?.target.value && setCurrency(event?.target.value);
  };

  return (
    <FormControl fullWidth error={errorState}>
      <TextField
        id="outlined-select-currency"
        select
        fullWidth
        label={captionLabel}
        value={currency}
        onChange={handleChange}
        slotProps={{
          input: {
            startAdornment: (
              <>
                {primaryIcon && <InputAdornment position="start">{primaryIcon}</InputAdornment>}
                {textPrimary && (
                  <>
                    <InputAdornment position="start">{textPrimary}</InputAdornment>
                    <Divider sx={{ height: 28, m: 0.5, opacity: '0.6' }} orientation="vertical" />
                  </>
                )}
              </>
            ),
            endAdornment: (
              <>
                {secondaryIcon && <InputAdornment position="end">{secondaryIcon}</InputAdornment>}
                {textSecondary && (
                  <>
                    <Divider sx={{ height: 28, m: 0.5, opacity: '0.6' }} orientation="vertical" />
                    <InputAdornment position="end">{textSecondary}</InputAdornment>
                  </>
                )}
              </>
            ),
          },
        }}
      >
        {currencies?.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </FormControl>
  );
};

export default FormControlSelect;
