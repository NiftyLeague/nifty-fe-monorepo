import { CreateMUIStyled } from '@mui/system';
import MuiStyled from '@mui/material/styles/styled';
import type { Theme } from '../types';

export const styled = MuiStyled as unknown as CreateMUIStyled<Theme>;

export default styled;
