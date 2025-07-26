import React, { useState } from 'react';
import { Icon } from '@nl/ui/base/icon';

import AlertStyles from './Alert.module.css';

interface Props {
  variant?: 'success' | 'danger' | 'warning' | 'info';
  className?: string;
  title: string;
  withIcon?: boolean;
  closable?: boolean;
  children?: React.ReactNode;
}

const icons: Record<'success' | 'danger' | 'warning' | 'info', React.ReactElement> = {
  danger: <Icon name="x-circle" />,
  success: <Icon name="check" />,
  warning: <Icon name="triangle-alert" />,
  info: <Icon name="info" />,
};

const Alert = ({ variant = 'success', className, title, withIcon, closable, children }: Props) => {
  const [visible, setVisible] = useState(true);
  const containerClasses = [AlertStyles['sbui-alert-container']];
  containerClasses.push(AlertStyles[`sbui-alert-container--${variant}`]);
  if (className) containerClasses.push(className);
  const descriptionClasses = [AlertStyles['sbui-alert-description']];
  descriptionClasses.push(AlertStyles[`sbui-alert-description--${variant}`]);
  const closeButtonClasses = [AlertStyles['sbui-close-button']];
  closeButtonClasses.push(AlertStyles[`sbui-close-button--${variant}`]);

  return (
    <>
      {visible && (
        <div className={containerClasses.join(' ')}>
          <div className="flex">
            <div className="flex-shrink-0">{withIcon && icons[variant]}</div>
            <div className="ml-3">
              <h3 className="sbui-alert-title">{title}</h3>
              <div className={descriptionClasses.join(' ')}>{children}</div>
            </div>
            {closable && (
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    aria-label="Close alert"
                    onClick={() => setVisible(false)}
                    className={closeButtonClasses.join(' ')}
                  >
                    <Icon name="x" size="lg" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Alert;
