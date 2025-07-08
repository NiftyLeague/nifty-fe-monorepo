// material-ui
import { useTheme } from '@nl/theme';
import MuiChip, { type ChipProps as MuiChipProps } from '@mui/material/Chip';

// ==============================|| CHIP ||============================== //

interface ChipProps extends MuiChipProps {
  colorType?: MuiChipProps['color'] | 'orange';
  sx?: object;
  disabled?: boolean;
  label?: React.ReactNode;
  avatar?: React.ReactElement | undefined;
  onDelete?: () => void;
  onClick?: () => void;
}

const Chip = ({ colorType, disabled, sx = {}, variant, ...others }: ChipProps) => {
  const theme = useTheme();
  const { mode } = theme.palette;

  let defaultSX = {
    color: mode === 'dark' ? 'var(--color-purple-200)' : 'var(--color-purple-600)',
    bgcolor: mode === 'dark' ? 'var(--color-purple-600)' : 'var(--color-purple-200)',
    ':hover': {
      color: 'var(--color-purple-200)',
      bgcolor: mode === 'dark' ? 'var(--color-purple-600)' : 'var(--color-purple-600)',
    },
  };

  let outlineSX = {
    color: 'var(--color-purple-400)',
    bgcolor: 'transparent',
    border: '1px solid',
    borderColor: 'var(--color-purple-400)',
    ':hover': {
      color: mode === 'dark' ? 'var(--color-purple-200)' : 'var(--color-purple-200)',
      bgcolor: mode === 'dark' ? 'var(--color-purple-600)' : 'var(--color-purple-600)',
    },
  };

  switch (colorType) {
    case 'info':
    case 'secondary':
      variant === 'outlined'
        ? (outlineSX = {
            color: 'var(--color-info)',
            bgcolor: 'transparent',
            border: '1px solid',
            borderColor: 'var(--color-info)',
            ':hover': {
              color: mode === 'dark' ? 'var(--color-info-light)' : 'var(--color-info-dark)',
              bgcolor: mode === 'dark' ? 'var(--color-info-dark)' : 'var(--color-info-light)',
            },
          })
        : (defaultSX = {
            color: mode === 'dark' ? 'var(--color-info-light)' : 'var(--color-info-dark)',
            bgcolor: mode === 'dark' ? 'var(--color-info-dark)' : 'var(--color-info-light)',
            ':hover': {
              color: 'var(--color-info-light)',
              bgcolor: mode === 'dark' ? 'var(--color-info-dark)' + 90 : 'var(--color-info-dark)',
            },
          });
      break;
    case 'success':
      variant === 'outlined'
        ? (outlineSX = {
            color: 'var(--color-success)',
            bgcolor: 'transparent',
            border: '1px solid',
            borderColor: 'var(--color-success)',
            ':hover': {
              color: mode === 'dark' ? 'var(--color-success-light)' : 'var(--color-success-dark)',
              bgcolor: mode === 'dark' ? 'var(--color-success-dark)' : 'var(--color-success-light)',
            },
          })
        : (defaultSX = {
            color: mode === 'dark' ? 'var(--color-success-light)' : 'var(--color-success-dark)',
            bgcolor: mode === 'dark' ? 'var(--color-success-dark)' : 'var(--color-success-light)',
            ':hover': {
              color: 'var(--color-success-light)',
              bgcolor: mode === 'dark' ? 'var(--color-success-dark)' + 90 : 'var(--color-success-dark)',
            },
          });
      break;
    case 'error':
      variant === 'outlined'
        ? (outlineSX = {
            color: 'var(--color-error)',
            bgcolor: 'transparent',
            border: '1px solid',
            borderColor: 'var(--color-error)',
            ':hover': {
              color: mode === 'dark' ? 'var(--color-error-light)' : 'var(--color-error-dark)',
              bgcolor: mode === 'dark' ? 'var(--color-error-dark)' : 'var(--color-error-light)',
            },
          })
        : (defaultSX = {
            color: mode === 'dark' ? 'var(--color-error-light)' : 'var(--color-error-dark)',
            bgcolor: mode === 'dark' ? 'var(--color-error-dark)' : 'var(--color-error-light)',
            ':hover': {
              color: 'var(--color-error-light)',
              bgcolor: mode === 'dark' ? 'var(--color-error-dark)' + 90 : 'var(--color-error-dark)',
            },
          });
      break;
    case 'orange':
      variant === 'outlined'
        ? (outlineSX = {
            color: 'var(--color-orange-400)',
            bgcolor: 'transparent',
            border: '1px solid',
            borderColor: 'var(--color-orange-400)',
            ':hover': {
              color: mode === 'dark' ? 'var(--color-orange-200)' : 'var(--color-orange-600)',
              bgcolor: mode === 'dark' ? 'var(--color-orange-600)' : 'var(--color-orange-200)',
            },
          })
        : (defaultSX = {
            color: mode === 'dark' ? 'var(--color-orange-200)' : 'var(--color-orange-600)',
            bgcolor: mode === 'dark' ? 'var(--color-orange-600)' : 'var(--color-orange-200)',
            ':hover': {
              color: 'var(--color-orange-200)',
              bgcolor: mode === 'dark' ? 'var(--color-orange-600)' + 90 : 'var(--color-orange-600)',
            },
          });
      break;
    case 'warning':
      variant === 'outlined'
        ? (outlineSX = {
            color: 'var(--color-warning)',
            bgcolor: 'transparent',
            border: '1px solid',
            borderColor: 'var(--color-warning)',
            ':hover': {
              color: mode === 'dark' ? 'var(--color-warning-light)' : 'var(--color-warning-dark)',
              bgcolor: mode === 'dark' ? 'var(--color-warning-dark)' : 'var(--color-warning-light)',
            },
          })
        : (defaultSX = {
            color: mode === 'dark' ? 'var(--color-warning-light)' : 'var(--color-warning-dark)',
            bgcolor: mode === 'dark' ? 'var(--color-warning-dark)' : 'var(--color-warning-light)',
            ':hover': {
              color: 'var(--color-warning-light)',
              bgcolor: mode === 'dark' ? 'var(--color-warning-dark)' : 'var(--color-warning-dark)',
            },
          });
      break;
    default:
  }

  if (disabled) {
    variant === 'outlined'
      ? (outlineSX = {
          color: 'var(--color-base-500)',
          bgcolor: 'transparent',
          border: '1px solid',
          borderColor: 'var(--color-base-500)',
          ':hover': { color: 'var(--color-base-500)', bgcolor: 'transparent' },
        })
      : (defaultSX = {
          color: 'var(--color-base-500)',
          bgcolor: 'var(--color-base-50)',
          ':hover': { color: 'var(--color-base-500)', bgcolor: 'var(--color-base-50)' },
        });
  }

  let SX = defaultSX;
  if (variant === 'outlined') {
    SX = outlineSX;
  }
  SX = { ...SX, ...sx };
  return <MuiChip {...others} sx={SX} />;
};

export default Chip;
