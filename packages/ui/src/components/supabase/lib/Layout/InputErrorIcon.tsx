import React from 'react';
import Icon from '@nl/ui/base/Icon';
import InputErrorIconStyles from './InputErrorIcon.module.css';

interface Props {
  style?: React.CSSProperties;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function InputErrorIcon({ style, size }: Props) {
  return (
    <div className={InputErrorIconStyles['sbui-input-error-icon']} style={style}>
      <Icon name="alert-circle" size={size} color="error" />
    </div>
  );
}
