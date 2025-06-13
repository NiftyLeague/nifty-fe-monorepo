import React from 'react';
import { Icon } from '../../types';
import { IconUser } from '../Icon/icons/IconUser';
import AvatarStyles from './Avatar.module.css';

interface Props {
  children?: React.ReactNode;
  src?: string | undefined;
  style?: React.CSSProperties;
  className?: string;
  alt?: string;
  responsive?: boolean;
  text?: string;
  variant?: 'circle' | 'square';
  AvatarIcon?: Icon;
  size: number;
}

export default function Avatar({ src, style, className, alt, text, AvatarIcon, size, children }: Props) {
  const classes = [AvatarStyles['sbui-avatar']];
  classes.push(className);
  let objectToRender;

  const imageExist = () => {
    if (!src) return false;
    const img = new Image();
    img.src = src;
    if (img.complete) {
      return true;
    } else {
      img.onload = () => {
        return true;
      };
      img.onerror = () => {
        return false;
      };
    }
  };

  if (imageExist()) {
    classes.push(AvatarStyles['sbui-avatar-image']);
    objectToRender = (
      <img className={classes.join(' ')} src={src} alt={alt} style={{ height: size, width: size, ...style }} />
    );
  } else if (AvatarIcon) {
    classes.push(AvatarStyles['sbui-avatar-icon']);
    objectToRender = (
      <div className={classes.join(' ')} style={{ height: size, width: size, ...style }}>
        <AvatarIcon />
      </div>
    );
  } else if (text) {
    classes.push(AvatarStyles['sbui-avatar-text']);
    objectToRender = (
      <div className={classes.join(' ')} style={{ height: size, width: size, ...style }}>
        <p>{text[0]}</p>
      </div>
    );
  } else if (children) {
    classes.push(AvatarStyles['sbui-avatar-children']);
    objectToRender = (
      <div className={classes.join(' ')} style={{ height: size, width: size, ...style }}>
        {children}
      </div>
    );
  } else {
    classes.push(AvatarStyles['sbui-avatar-fallback']);
    objectToRender = (
      <div className={classes.join(' ')} style={{ height: size, width: size, ...style }}>
        <IconUser />
      </div>
    );
  }

  return <>{objectToRender}</>;
}
