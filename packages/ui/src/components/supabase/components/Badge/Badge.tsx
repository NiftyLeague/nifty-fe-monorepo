import BadgeStyles from './Badge.module.css';

interface Props {
  color?: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink';
  children: string;
  size?: 'sm' | 'lg';
  dot?: boolean;
}

function Badge({ color, children, size, dot }: Props) {
  const classes = [BadgeStyles['sbui-badge']];
  if (color) {
    classes.push(BadgeStyles[`sbui-badge--${color}`]);
  }
  if (size === 'lg') {
    classes.push(BadgeStyles['sbui-badge--lg']);
  }

  return (
    <span className={classes.join(' ')}>
      {dot && (
        <svg
          className={`${BadgeStyles[`sbui-badge-dot`]} ${BadgeStyles[`sbui-badge--${color}`]}`}
          fill="currentColor"
          viewBox="0 0 8 8"
        >
          <circle cx="4" cy="4" r="3" />
        </svg>
      )}

      {children}
    </span>
  );
}
export default Badge;
