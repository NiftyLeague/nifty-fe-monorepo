import { SxProps } from '@mui/material';

export interface DialogProps {
  dialogTitle?: React.ReactNode | string;
  sx?: SxProps<object>;
  children?: React.ReactNode;
}

export interface DialogAction {
  children: React.ReactElement;
  isOpen?: boolean;
}
