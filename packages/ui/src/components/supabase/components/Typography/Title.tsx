import React, { PropsWithChildren, JSX } from 'react';
import TitleStyles from './Title.module.css';

interface Props {
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  style?: React.CSSProperties;
}

function Title({ className, level = 1, children, style }: PropsWithChildren<Props>) {
  const classes = [TitleStyles['sbui-typography-title']];
  if (className) {
    classes.push(className);
  }
  const CustomTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <CustomTag style={style} className={classes.join(' ')}>
      {children}
    </CustomTag>
  );
}

export default Title;
