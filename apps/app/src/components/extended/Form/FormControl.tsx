// material-ui
import { Divider, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import MUIFormControl from '@mui/material/FormControl';

import Icon, { type IconName } from '@nl/ui/base/Icon';

// ==============================|| FORM CONTROL ||============================== //

interface FormControlProps {
  captionLabel?: string;
  formState?: string;
  iconPrimary?: IconName;
  iconSecondary?: IconName;
  placeholder?: string;
  textPrimary?: string;
  textSecondary?: string;
}

const FormControl = ({
  captionLabel,
  formState,
  iconPrimary,
  iconSecondary,
  placeholder,
  textPrimary,
  textSecondary,
}: FormControlProps) => {
  const primaryIcon = iconPrimary ? <Icon name={iconPrimary} size="sm" color="gray" /> : null;
  const secondaryIcon = iconSecondary ? <Icon name={iconSecondary} size="sm" color="gray" /> : null;

  const errorState = formState === 'error';

  return (
    <MUIFormControl fullWidth error={errorState}>
      <InputLabel>{captionLabel}</InputLabel>
      <OutlinedInput
        placeholder={placeholder}
        type="text"
        label={captionLabel}
        startAdornment={
          <>
            {primaryIcon && <InputAdornment position="start">{primaryIcon}</InputAdornment>}
            {textPrimary && (
              <>
                <InputAdornment position="start">{textPrimary}</InputAdornment>
                <Divider sx={{ height: 28, m: 0.5, mr: 1.5, opacity: '0.6' }} orientation="vertical" />
              </>
            )}
          </>
        }
        endAdornment={
          <>
            {secondaryIcon && <InputAdornment position="end">{secondaryIcon}</InputAdornment>}
            {textSecondary && (
              <>
                <Divider sx={{ height: 28, m: 0.5, opacity: '0.6' }} orientation="vertical" />
                <InputAdornment position="end">{textSecondary}</InputAdornment>
              </>
            )}
          </>
        }
      />
    </MUIFormControl>
  );
};

export default FormControl;
