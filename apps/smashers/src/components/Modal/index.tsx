'use client';

import { ReactNode, useEffect } from 'react';
import { cn } from '@nl/ui/lib/utils';
import styles from './index.module.css';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

const Modal = ({ isOpen, onClose, children, className = '', contentClassName = '' }: ModalProps) => {
  // Close on Escape key
  useEffect(() => {
    const htmlElement = document.querySelector('html') as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      htmlElement.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      htmlElement.style.overflow = ''; // Re-enable scrolling when modal is closed
    };
  }, [isOpen, onClose]);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(styles.modal, className, { [styles.hidden as string]: !isOpen })}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div className={cn(styles.modal_content, contentClassName)}>
        <button className={styles.close_icon} onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
