import { useContext, cloneElement } from 'react';
import { IconButton, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DialogContext } from '.';
import type { DialogAction } from '@/types/dialog';
import callAll from '@/utils/callAll';

const IconButtonStyle = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  top: 0,
  color: theme.palette.grey[500],
}));

const DialogActionComp = ({ children, isOpen }: DialogAction) => {
  const [, setIsOpen] = useContext(DialogContext);
  return cloneElement(children as React.ReactElement<any>, {
    onClick: callAll(() => setIsOpen(isOpen || false), (children as React.ReactElement<any>).props.onClick),
  });
};

const DialogTrigger = ({ children }: DialogAction) => DialogActionComp({ children, isOpen: true });

const DialogDismissButton = ({ children }: DialogAction) => DialogActionComp({ children, isOpen: false });

const CloseIconButton = () => {
  return (
    <DialogDismissButton>
      <IconButtonStyle aria-label="close">
        <CloseIcon />
      </IconButtonStyle>
    </DialogDismissButton>
  );
};
export { DialogTrigger, DialogDismissButton, CloseIconButton };
