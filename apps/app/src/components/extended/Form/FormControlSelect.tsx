'use client';

import { useState } from 'react';
import { Divider, FormControl, InputAdornment, MenuItem, TextField } from '@mui/material';

import { Icon, type IconName } from '@nl/ui/base/icon';

// ==============================|| FORM CONTROL SELECT ||============================== //

interface FormControlSelectProps {
  captionLabel?: string;
  currencies?: { value: string; label: string }[];
  formState?: string;
  iconPrimary?: IconName;
  iconSecondary?: IconName;
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
  const primaryIcon = iconPrimary ? <Icon name={iconPrimary} size="sm" color="gray" /> : null;
  const secondaryIcon = iconSecondary ? <Icon name={iconSecondary} size="sm" color="gray" /> : null;

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
