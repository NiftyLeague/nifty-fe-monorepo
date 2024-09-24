import { styled } from '@nl/theme';
import { InputLabel as MuiInputLabel, InputLabelProps } from '@mui/material';

const BInputLabel = styled((props: MUIInputLabelProps) => <MuiInputLabel {...props} />, {
  shouldForwardProp: prop => prop !== 'horizontal',
})(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
  marginBottom: 8,
  variants: [
    {
      props: ({ horizontal }) => horizontal,
      style: {
        marginBottom: 0,
      },
    },
  ],
}));

interface MUIInputLabelProps extends InputLabelProps {
  horizontal?: boolean;
}

const InputLabel = ({ children, horizontal = false, ...others }: MUIInputLabelProps) => (
  <BInputLabel horizontal={horizontal} {...others}>
    {children}
  </BInputLabel>
);

export default InputLabel;
