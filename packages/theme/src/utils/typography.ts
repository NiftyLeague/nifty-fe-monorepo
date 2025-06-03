import type { FontFamily, Theme, ThemeOptions } from '../types';

const customTypography = (theme: Theme, borderRadius: number, fontFamily: FontFamily): ThemeOptions['typography'] => ({
  fontFamily: fontFamily.default.style.fontFamily,
  fontWeightLight: 100,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  fontSize: 16,
  h1: {
    fontSize: '2.5rem', // 40px
    color: theme.palette.text.primary,
    fontFamily: fontFamily.header.style.fontFamily,
    fontWeight: fontFamily.header.style.fontWeight,
    fontStyle: fontFamily.header.style.fontStyle,
  },
  h2: {
    fontSize: '1.8rem', // 28px
    color: theme.palette.text.primary,
    fontFamily: fontFamily.header.style.fontFamily,
    fontWeight: fontFamily.header.style.fontWeight,
    fontStyle: fontFamily.header.style.fontStyle,
  },
  h3: {
    fontSize: '1.25rem', // 20px
    color: theme.palette.text.primary,
    fontFamily: fontFamily.header.style.fontFamily,
    fontWeight: fontFamily.header.style.fontWeight,
    fontStyle: fontFamily.header.style.fontStyle,
  },
  h4: {
    fontSize: '1rem', // 16px
    color: theme.palette.text.secondary,
    fontFamily: fontFamily.header.style.fontFamily,
    fontWeight: fontFamily.header.style.fontWeight,
    fontStyle: fontFamily.header.style.fontStyle,
  },
  h5: {
    fontSize: '0.875rem', // 14px
    color: theme.palette.text.secondary,
    fontFamily: fontFamily.subheader.style.fontFamily,
    fontWeight: fontFamily.subheader.style.fontWeight,
    fontStyle: fontFamily.subheader.style.fontStyle,
  },
  h6: {
    fontSize: '0.75rem', // 12px
    color: theme.palette.text.secondary,
    fontFamily: fontFamily.subheader.style.fontFamily,
    fontWeight: fontFamily.subheader.style.fontWeight,
    fontStyle: fontFamily.subheader.style.fontStyle,
  },
  subtitle1: {
    fontSize: '0.875rem', // 14px
    fontWeight: 500,
    color: theme.palette.text.primary,
  },
  subtitle2: {
    fontSize: '0.75rem', // 12px
    fontWeight: 400,
    color: theme.palette.text.secondary,
  },
  caption: {
    fontSize: '0.75rem', // 12px
    color: theme.palette.text.secondary,
    fontWeight: 400,
  },
  body1: {
    fontSize: '1rem', // 16px
    fontWeight: 400,
    lineHeight: '1.334em',
  },
  body2: {
    fontSize: '0.875rem', // 14px
    letterSpacing: '0em',
    fontWeight: 400,
    lineHeight: '1.5em',
    color: theme.palette.text.primary,
  },
  button: {
    textTransform: 'capitalize',
    fontSize: '0.875rem', // 14px
  },
  customInput: {
    marginTop: 1,
    marginBottom: 1,
    '& > label': { top: 23, left: 0, color: theme.palette.text.secondary, '&[data-shrink="false"]': { top: 5 } },
    '& > div > input': { padding: '30.5px 14px 11.5px !important' },
    '& legend': { display: 'none' },
    '& fieldset': { top: 0 },
  },
  mainContent: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    minHeight: 'calc(100vh - 100px)',
    flexGrow: 1,
    borderRadius: `${borderRadius}px`,
  },
  menuCaption: {
    fontSize: '0.875rem', // 14px
    fontWeight: 500,
    color: theme.palette.text.secondary,
    padding: '6px',
    textTransform: 'capitalize',
    marginTop: '10px',
  },
  subMenuCaption: {
    fontSize: '0.75rem', // 12px
    fontWeight: 500,
    color: theme.palette.text.secondary,
    textTransform: 'capitalize',
  },
  commonAvatar: { cursor: 'pointer', borderRadius: '8px' },
  smallAvatar: {
    width: '22px',
    height: '22px',
    fontSize: '1rem', // 16px
  },
  mediumAvatar: {
    width: '34px',
    height: '34px',
    fontSize: '1.25rem', // 20px
  },
  largeAvatar: {
    width: '44px',
    height: '44px',
    fontSize: '1.5rem', // 24px
  },
});

export default customTypography;
