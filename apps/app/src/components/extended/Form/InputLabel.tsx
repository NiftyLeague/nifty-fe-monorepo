import { styled } from '@nl/theme';
import { InputLabel as MuiInputLabel, InputLabelProps } from '@mui/material';

const BInputLabel = styled((props: MUIInputLabelProps) => <MuiInputLabel {...props} />, {
  shouldForwardProp: prop => prop !== 'horizontal',
})(({ theme, horizontal }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
  marginBottom: horizontal ? 0 : 8,
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
