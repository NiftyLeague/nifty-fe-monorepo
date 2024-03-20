import SpaceStyles from './Space.module.css';

type SpaceProps = {
  direction?: 'vertical' | 'horizontal' | 'row';
  size?: number;
  className?: string;
  block?: boolean;
  style?: React.CSSProperties;
  minus?: boolean;
  children: React.ReactNode;
};

function Space({ direction = 'horizontal', size = 2, className, block, style, minus, children }: SpaceProps) {
  const classes = [];
  classes.push(SpaceStyles[direction === 'vertical' ? 'sbui-space-col' : 'sbui-space-row']);
  classes.push(
    SpaceStyles['sbui-' + (minus ? 'minus-' : '') + 'space-' + (direction === 'vertical' ? 'y' : 'x') + '-' + size],
  );
  if (block) {
    classes.push(SpaceStyles['sbui-space--block']);
  }
  if (className) {
    classes.push(className);
  }

  return (
    <div className={classes.join(' ')} style={style}>
      {children}
    </div>
  );
}

export default Space;
