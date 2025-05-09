import { useContext } from 'react';
import { Dialog as DialogMUI, DialogContent as DialogContentMUI, DialogTitle } from '@mui/material';
import { DialogContext } from '.';
import type { DialogProps } from '@/types/dialog';
import { CloseIconButton } from './DialogActions';

const DialogContentBase = (props: DialogProps) => {
  const [isOpen, setIsOpen] = useContext(DialogContext);

  if (!isOpen) return null;
  return <DialogMUI {...props} onClose={() => setIsOpen(false)} open={isOpen} />;
};

const DialogContent = ({ dialogTitle, children, ...props }: DialogProps): React.ReactNode => (
  <DialogContentBase {...props}>
    <DialogTitle>
      {dialogTitle}
      <CloseIconButton />
    </DialogTitle>
    <DialogContentMUI dividers>{children}</DialogContentMUI>
  </DialogContentBase>
);

export { DialogContent, DialogContentBase };
