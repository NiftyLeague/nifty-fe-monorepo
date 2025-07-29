import React, { useEffect } from 'react';
import ModalStyles from './Modal.module.css';
import Button from '../Button';
import Space from '../Space';

import * as Dialog from '@radix-ui/react-dialog';
import { Transition, TransitionChild } from '@headlessui/react';

export interface AnimationTailwindClasses {
  enter?: string;
  enterFrom?: string;
  enterTo?: string;
  leave?: string;
  leaveFrom?: string;
  leaveTo?: string;
}

export interface Props {
  children?: React.ReactNode;
  customFooter?: React.ReactNode;
  closable?: boolean;
  description?: string;
  hideFooter?: boolean;
  alignFooter?: 'right' | 'left';
  layout?: 'horizontal' | 'vertical';
  icon?: React.ReactNode;
  loading?: boolean;
  onCancel?: () => void;
  cancelText?: string;
  onConfirm?: React.MouseEventHandler<HTMLButtonElement>;
  confirmText?: string;
  showIcon?: boolean;
  footerBackground?: boolean;
  title?: string;
  variant?: 'danger' | 'warning' | 'success';
  visible: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  style?: React.CSSProperties;
  overlayStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  className?: string;
  overlayClassName?: string;
  transition?: AnimationTailwindClasses;
  transitionOverlay?: AnimationTailwindClasses;
  triggerElement?: React.ReactNode;
}

const Modal = ({
  children,
  customFooter = undefined,
  closable,
  description,
  hideFooter = false,
  alignFooter = 'left',
  layout = 'horizontal',
  loading = false,
  cancelText = 'Cancel',
  onConfirm = () => {},
  onCancel = () => {},
  confirmText = 'Confirm',
  title,
  footerBackground,
  icon,
  variant = 'success',
  visible = false,
  size = 'lg',
  style,
  overlayStyle,
  contentStyle,
  className = '',
  overlayClassName,
  triggerElement,
}: Props) => {
  const [open, setOpen] = React.useState(visible ? visible : false);

  useEffect(() => {
    setOpen(visible);
  }, [visible]);

  function stopPropagation(e: React.MouseEvent) {
    e.stopPropagation();
  }

  const footerClasses = [ModalStyles['sbui-modal-footer']];
  if (footerBackground) {
    footerClasses.push(ModalStyles['sbui-modal-footer--with-bg']);
  }

  const modalClasses = [ModalStyles[`sbui-modal`], ModalStyles[`sbui-modal--${size}`]];
  if (className) modalClasses.push(className);

  const overlayClasses = [ModalStyles['sbui-modal-overlay']];
  if (overlayClassName) overlayClasses.push(overlayClassName);

  const footerContent = customFooter ? (
    customFooter
  ) : (
    <Space
      style={{
        width: '100%',
        justifyContent: layout === 'vertical' ? 'center' : alignFooter === 'right' ? 'flex-end' : 'flex-start',
      }}
    >
      <Button type="outline" onClick={onCancel} disabled={loading}>
        {cancelText}
      </Button>
      <Button onClick={onConfirm} loading={loading} danger={variant === 'danger'}>
        {confirmText}
      </Button>
    </Space>
  );

  function handleOpenChange(open: boolean) {
    if (visible !== undefined && !open) {
      // controlled component behaviour
      onCancel();
    } else {
      // un-controlled component behaviour
      setOpen(open);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      {triggerElement && (
        <Dialog.Trigger className={ModalStyles[`sbui-modal__trigger`]}>{triggerElement}</Dialog.Trigger>
      )}
      <Transition show={open}>
        <Dialog.Overlay>
          <TransitionChild
            enter={ModalStyles[`sbui-modal-overlay--enter`]}
            enterFrom={ModalStyles[`sbui-modal-overlay--enterFrom`]}
            enterTo={ModalStyles[`sbui-modal-overlay--enterTo`]}
            leave={ModalStyles[`sbui-modal-overlay--leave`]}
            leaveFrom={ModalStyles[`sbui-modal-overlay--leaveFrom`]}
            leaveTo={ModalStyles[`sbui-modal-overlay--leaveTo`]}
          >
            <div className={ModalStyles['sbui-modal-overlay-container']}>
              <div className={overlayClasses.join(' ')} style={overlayStyle}></div>
            </div>
          </TransitionChild>
        </Dialog.Overlay>
        <Dialog.Content forceMount style={{ width: '100vw' }}>
          <div
            className={ModalStyles['sbui-modal-container'] + ' ' + className}
            onClick={() => (onCancel ? onCancel() : null)}
          >
            <div className={ModalStyles['sbui-modal-flex-container']}>
              <TransitionChild
                enter={ModalStyles[`sbui-modal--enter`]}
                enterFrom={ModalStyles[`sbui-modal--enterFrom`]}
                enterTo={ModalStyles[`sbui-modal--enterTo`]}
                leave={ModalStyles[`sbui-modal--leave`]}
                leaveFrom={ModalStyles[`sbui-modal--leaveFrom`]}
                leaveTo={ModalStyles[`sbui-modal--leaveTo`]}
                // className="fixed inset-0 overflow-y-auto"
              >
                <div
                  className={modalClasses.join(' ')}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-headline"
                  onClick={stopPropagation}
                  style={style}
                >
                  <div className={ModalStyles['sbui-modal-content']} style={contentStyle}>
                    <Space
                      size={5}
                      style={{ alignItems: layout === 'vertical' ? 'center' : 'flex-start' }}
                      direction={layout}
                    >
                      {icon ? icon : null}
                      <Space
                        size={4}
                        direction="vertical"
                        style={{
                          alignItems: 'flex-start',
                          textAlign: layout === 'vertical' ? 'center' : undefined,
                          width: '100%',
                        }}
                      >
                        <span style={{ width: 'inherit' }}>
                          {title && <Dialog.Title className="my-0 text-lg">{title}</Dialog.Title>}
                          {description && <Dialog.Description>{description}</Dialog.Description>}
                        </span>

                        {children}
                        {!footerBackground && !hideFooter && footerContent}
                      </Space>
                    </Space>
                  </div>
                  {!hideFooter && footerBackground && <div className={footerClasses.join(' ')}>{footerContent}</div>}
                  {closable && (
                    <div className={ModalStyles['sbui-modal-close-container']}>
                      <Button onClick={onCancel} type="text" shadow={false} icon="x" />
                    </div>
                  )}
                </div>
              </TransitionChild>
            </div>
          </div>
        </Dialog.Content>
      </Transition>
    </Dialog.Root>
  );
};

export default Modal;
