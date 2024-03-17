import type { ThemeOptions } from '@mui/material/styles';

const customMixins = (): ThemeOptions['mixins'] => ({
  toolbar: {
    minHeight: '48px',
    padding: '16px',
    '@media (min-width: 600px)': {
      minHeight: '48px',
    },
  },
});

export default customMixins;
