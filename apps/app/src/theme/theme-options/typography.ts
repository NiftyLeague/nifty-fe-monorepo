import type { Theme, ThemeOptions } from '@mui/material/styles';

const customTypography = (
  theme: Theme,
  borderRadius: number,
  // fontFamily: string,
): ThemeOptions['typography'] => ({
  // fontFamily,
  h1: {
    fontSize: '2.125rem',
    color: theme.palette.text.primary,
    fontWeight: 700,
  },
  h2: {
    fontSize: '1.5rem',
    color: theme.palette.text.primary,
    fontWeight: 700,
  },
  h3: {
    fontSize: '1.25rem',
    color: theme.palette.text.secondary,
    fontWeight: 600,
  },
  h4: {
    fontSize: '16px',
    color: theme.palette.text.secondary,
    fontWeight: 600,
  },
  h5: {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
    fontWeight: 500,
  },
  h6: {
    fontWeight: 500,
    color: theme.palette.text.secondary,
    fontSize: '0.75rem',
  },
  subtitle1: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.palette.text.primary,
  },
  subtitle2: {
    fontSize: '0.75rem',
    fontWeight: 400,
    color: theme.palette.text.secondary,
  },
  caption: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    fontWeight: 400,
  },
  body1: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: '1.334em',
  },
  body2: {
    letterSpacing: '0em',
    fontWeight: 400,
    lineHeight: '1.5em',
    color: theme.palette.text.primary,
  },
  button: {
    textTransform: 'capitalize',
  },
  customInput: {
    marginTop: 1,
    marginBottom: 1,
    '& > label': {
      top: 23,
      left: 0,
      color: theme.palette.text.secondary,
      '&[data-shrink="false"]': {
        top: 5,
      },
    },
    '& > div > input': {
      padding: '30.5px 14px 11.5px !important',
    },
    '& legend': {
      display: 'none',
    },
    '& fieldset': {
      top: 0,
    },
  },
  mainContent: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    minHeight: 'calc(100vh - 100px)',
    flexGrow: 1,
    borderRadius: `${borderRadius}px`,
  },
  menuCaption: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.palette.text.secondary,
    padding: '6px',
    textTransform: 'capitalize',
    marginTop: '10px',
  },
  subMenuCaption: {
    fontSize: '0.6875rem',
    fontWeight: 500,
    color: theme.palette.text.secondary,
    textTransform: 'capitalize',
  },
  commonAvatar: {
    cursor: 'pointer',
    borderRadius: '8px',
  },
  smallAvatar: {
    width: '22px',
    height: '22px',
    fontSize: '16px',
  },
  mediumAvatar: {
    width: '34px',
    height: '34px',
    fontSize: '1.2rem',
  },
  largeAvatar: {
    width: '44px',
    height: '44px',
    fontSize: '1.5rem',
  },
});

export default customTypography;
