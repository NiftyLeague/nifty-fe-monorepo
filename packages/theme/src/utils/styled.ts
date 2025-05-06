import { CreateMUIStyled } from '@mui/system';
import { styled as MuiStyled } from '@mui/material/styles';
import type { Theme } from '../types';

export const styled = MuiStyled as unknown as CreateMUIStyled<Theme>;

export default styled;
