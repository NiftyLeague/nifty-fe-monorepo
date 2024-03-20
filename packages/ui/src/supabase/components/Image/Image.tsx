import React from 'react';
import ImageStyles from './Image.module.css';

interface Props {
  source?: string;
  style?: React.CSSProperties;
  className?: string;
  type?: 'rounded' | 'circle';
  alt?: string;
  responsive?: boolean;
}

export default function Image({ source, style, className, type, alt, responsive }: Props) {
  const classes = [ImageStyles['sbui-image-normal']];
  classes.push(type === 'rounded' ? ImageStyles['sbui-image-rounded'] : '');
  classes.push(type === 'circle' ? ImageStyles['sbui-image-circle'] : '');
  if (responsive) classes.push(ImageStyles['sbui-image-responsive']);
  if (className) classes.push(className);
  return (
    <>
      <img className={classes.join(' ')} src={source} style={style} alt={alt} />
    </>
  );
}
