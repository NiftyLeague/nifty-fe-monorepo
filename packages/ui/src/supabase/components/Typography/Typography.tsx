import { JSX } from 'react';
import TypographyStyles from './Typography.module.css';
import Title from './Title';
import Text from './Text';
import Link from './Link';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
}

function Typography({ children, className, tag = 'div', style }: TypographyProps) {
  const classes = [TypographyStyles['sbui-typography'], TypographyStyles['sbui-typography-container']];
  if (className) {
    classes.push(className);
  }
  const CustomTag: keyof JSX.IntrinsicElements = tag;
  return (
    <CustomTag style={style} className={classes.join(' ')}>
      {children}
    </CustomTag>
  );
}

Typography.Title = Title;
Typography.Text = Text;
Typography.Link = Link;

export default Typography;
