import React from 'react';
import { IconAlertCircle } from './../../index';
import InputErrorIconStyles from './InputErrorIcon.module.css';

interface Props {
  style?: React.CSSProperties;
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'xlarge';
}

export default function InputErrorIcon({ style, size }: Props) {
  return (
    <div className={InputErrorIconStyles['sbui-input-error-icon']} style={style}>
      <IconAlertCircle size={size} strokeWidth={2} stroke={'#f56565'} className="" />
    </div>
  );
}
