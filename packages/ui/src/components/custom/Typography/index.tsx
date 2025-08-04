import type { JSX } from 'react';
import { cn } from '@nl/ui/utils';

import { Link } from './link';
import { Text } from './text';
import { Title } from './title';

interface TypographyProps<T extends React.ElementType> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  tag?: T;
}

function Typography<T extends React.ElementType>({
  children,
  className,
  tag,
  ...rest
}: TypographyProps<T> & React.ComponentPropsWithoutRef<T>) {
  const CustomTag = tag || 'div';
  const classes = cn('text-foreground text-base font-default font-normal tracking-default', className);

  return (
    <CustomTag className={classes} style={rest.style} {...rest}>
      {children}
    </CustomTag>
  );
}

Typography.Link = Link;
Typography.Text = Text;
Typography.Title = Title;

export { Typography, Link, Text, Title };

export default Typography;
