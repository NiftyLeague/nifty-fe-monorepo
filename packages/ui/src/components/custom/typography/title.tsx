import { cn } from '@nl/ui/utils';

interface TitleProps {
  className?: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  style?: React.CSSProperties;
}

export function Title({ children, className, level, style }: React.PropsWithChildren<TitleProps>) {
  const CustomTag = `h${level}` as keyof React.JSX.IntrinsicElements;

  const levelClasses = {
    1: 'text-4xl font-bold font-header tracking-header',
    2: 'text-3xl font-bold font-header tracking-header',
    3: 'text-2xl font-bold font-header tracking-header',
    4: 'text-xl font-normal font-subheader tracking-subheader',
    5: 'text-lg font-normal font-subheader tracking-subheader',
    6: 'text-base font-normal font-subheader tracking-subheader',
  };

  const classes = cn('scroll-m-20 text-foreground text-balance', levelClasses[level], className);

  return (
    <CustomTag className={classes} style={style}>
      {children}
    </CustomTag>
  );
}

export default Title;
