import { useContext, cloneElement } from 'react';
import { IconButton, styled } from '@mui/material';
import Icon from '@nl/ui/base/Icon';
import { DialogContext } from '.';
import type { DialogAction } from '@/types/dialog';
import callAll from '@/utils/callAll';

const IconButtonStyle = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  top: 0,
  color: 'var(--color-foreground-2)',
}));

const DialogActionComp = ({ children, isOpen }: DialogAction) => {
  const [, setIsOpen] = useContext(DialogContext);
  if (!children || typeof children !== 'object' || !('props' in children)) {
    throw new Error('DialogActionComp expects a valid ReactElement as children');
  }
  const childElement = children as React.ReactElement<any, any>;
  return cloneElement(childElement, { onClick: callAll(() => setIsOpen(isOpen || false), childElement.props.onClick) });
};

const DialogTrigger = ({ children }: DialogAction) => DialogActionComp({ children, isOpen: true });

const DialogDismissButton = ({ children }: DialogAction) => DialogActionComp({ children, isOpen: false });

const CloseIconButton = () => {
  return (
    <DialogDismissButton>
      <IconButtonStyle aria-label="close">
        <Icon name="x" size="lg" />
      </IconButtonStyle>
    </DialogDismissButton>
  );
};
export { DialogTrigger, DialogDismissButton, CloseIconButton };
