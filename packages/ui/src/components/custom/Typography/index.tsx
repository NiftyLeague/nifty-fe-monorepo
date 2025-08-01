import type { JSX } from 'react';
import { cn } from '@nl/ui/utils';

import Link from './Link';
import Text from './Text';
import Title from './Title';

interface TypographyProps {
  className?: string;
  style?: React.CSSProperties;
  tag?: keyof JSX.IntrinsicElements;
}

function Typography({ children, className, tag = 'div', style }: React.PropsWithChildren<TypographyProps>) {
  const classes = cn('text-foreground text-base font-default font-normal tracking-default', className);
  const CustomTag: keyof JSX.IntrinsicElements = tag;
  return (
    <CustomTag className={classes} style={style}>
      {children}
    </CustomTag>
  );
}

Typography.Link = Link;
Typography.Text = Text;
Typography.Title = Title;

export { Typography, Link, Text, Title };

export default Typography;
