// project imports
import type { Theme, ThemeOptions } from '../types';

const customComponents = (theme: Theme, borderRadius: number, outlinedFilled: boolean): ThemeOptions['components'] => {
  const mode = theme.palette.mode;

  return {
    MuiButton: {
      styleOverrides: {
        root: { fontWeight: 'var(--font-weight-normal)', borderRadius: 'var(--border-radius-default)' },
        outlinedPrimary: { color: 'var(--color-foreground)', borderColor: 'var(--color-purple)' },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { backgroundImage: 'none' }, rounded: { borderRadius: 'var(--border-radius-default)' } },
    },
    MuiCardHeader: {
      styleOverrides: { root: { color: 'var(--color-foreground)', padding: '24px' }, title: { fontSize: '1.125rem' } },
    },
    MuiCardContent: { styleOverrides: { root: { padding: '24px' } } },
    MuiCardActions: { styleOverrides: { root: { padding: '24px' } } },
    MuiAlert: { styleOverrides: { root: { alignItems: 'center' }, outlined: { border: '1px dashed' } } },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: 'var(--color-foreground)',
          paddingTop: '10px',
          paddingBottom: '10px',
          '&.Mui-selected': {
            color: 'var(--color-primary-foreground)',
            backgroundColor: 'var(--color-purple)',
            '&:hover': { backgroundColor: 'var(--color-purple)' },
            '& .MuiListItemIcon-root': { color: 'var(--color-primary-foreground)' },
          },
          '&:hover': {
            backgroundColor: 'var(--color-purple)',
            color: 'var(--color-primary-foreground)',
            '& .MuiListItemIcon-root': { color: 'var(--color-primary-foreground)' },
          },
        },
      },
    },
    MuiListItemIcon: { styleOverrides: { root: { color: 'var(--color-foreground)', minWidth: '36px' } } },
    MuiListItemText: { styleOverrides: { primary: { color: 'var(--color-foreground)' } } },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: 'var(--color-foreground)',
          '&::placeholder': { color: 'var(--color-muted-foreground)', fontSize: '0.875rem' },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: outlinedFilled ? 'var(--color-background)' : 'transparent',
          borderRadius: 'var(--border-radius-default)',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-foreground)' },
          '&:hover $notchedOutline': { borderColor: 'var(--color-purple-200)' },
          '&.MuiInputBase-multiline': { padding: 1 },
        },
        input: {
          fontWeight: 'var(--font-weight-normal)',
          background: outlinedFilled ? 'var(--color-background)' : 'transparent',
          padding: '15.5px 14px',
          borderRadius: 'var(--border-radius-default)',
          '&.MuiInputBase-inputSizeSmall': {
            padding: '10px 14px',
            '&.MuiInputBase-inputAdornedStart': { paddingLeft: 0 },
          },
        },
        inputAdornedStart: { paddingLeft: 4 },
        notchedOutline: { borderRadius: 'var(--border-radius-default)' },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: { '&.Mui-disabled': { color: 'var(--color-foreground)' } },
        mark: { backgroundColor: 'var(--color-muted)', width: '4px' },
        valueLabel: { color: mode === 'dark' ? 'var(--color-purple)' : 'var(--color-purple-200)' },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiAutocomplete-tag': {
            background: mode === 'dark' ? 'var(--color-foreground)' : 'var(--color-blue)',
            borderRadius: 'var(--border-radius-default)',
            color: 'var(--color-foreground)',
            '.MuiChip-deleteIcon': { color: mode === 'dark' ? 'var(--color-foreground)' : 'var(--color-blue)' },
          },
        },
        popper: {
          borderRadius: 'var(--border-radius-default)',
          boxShadow:
            '0px 8px 10px -5px rgb(0 0 0 / 20%), 0px 16px 24px 2px rgb(0 0 0 / 14%), 0px 6px 30px 5px rgb(0 0 0 / 12%)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: 'var(--color-divider)', opacity: mode === 'dark' ? 0.2 : 1 } },
    },
    MuiSelect: { styleOverrides: { select: { '&:focus': { backgroundColor: 'transparent' } } } },
    MuiAvatar: {
      styleOverrides: { root: { color: 'var(--color-background)', background: 'var(--color-foreground)' } },
    },
    MuiChip: { styleOverrides: { root: { '&.MuiChip-deletable .MuiChip-deleteIcon': { color: 'inherit' } } } },
    MuiTabs: {
      styleOverrides: { flexContainer: { borderBottom: '1px solid', borderColor: 'var(--color-foreground)' } },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { padding: '12px 0 12px 0', backgroundColor: 'var(--color-popover)', width: '1000px', maxWidth: '91vw' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'var(--color-border)',
          '&.MuiTableCell-head': { fontSize: '0.875rem', color: 'var(--color-muted-foreground)', fontWeight: 500 },
        },
      },
    },
    MuiTooltip: { styleOverrides: { tooltip: { color: 'var(--color-muted)', background: 'var(--color-foreground)' } } },
    MuiDialogTitle: { styleOverrides: { root: { fontSize: '1.25rem' } } },
    MuiDialogContent: { styleOverrides: { dividers: { borderColor: 'var(--color-border)' } } },
  };
};

export default customComponents;
