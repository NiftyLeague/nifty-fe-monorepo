import { cn } from '@nl/ui/utils';

export interface TextProps {
  blockquote?: boolean;
  className?: string;
  code?: boolean;
  disabled?: boolean;
  keyboard?: boolean;
  mark?: boolean;
  sm?: boolean;
  strikethrough?: boolean;
  strong?: boolean;
  style?: React.CSSProperties;
  underline?: boolean;
  variant?: 'default' | 'error' | 'muted' | 'primary' | 'secondary' | 'success' | 'warning';
  xs?: boolean;
}

function Text({
  blockquote,
  children,
  className,
  code,
  disabled,
  keyboard,
  mark,
  sm,
  strikethrough,
  strong,
  style,
  underline,
  variant = 'default',
  xs,
}: React.PropsWithChildren<TextProps>) {
  const variantClasses = {
    default: 'text-foreground',
    error: 'text-error',
    muted: 'text-muted-foreground',
    primary: 'text-primary-foreground',
    secondary: 'text-secondary-foreground',
    success: 'text-success',
    warning: 'text-warning',
  };

  const classes = cn(
    'text-base font-default font-normal tracking-default',
    variantClasses[variant],
    { 'text-muted-foreground cursor-not-allowed select-none': disabled },
    { underline: underline },
    { 'line-through': strikethrough },
    { 'text-sm leading-none': sm },
    { 'text-xs leading-none': xs },
  );

  if (blockquote) {
    return (
      <blockquote className={cn(classes, 'mt-6 border-l-2 pl-6 italic', className)} style={style}>
        {children}
      </blockquote>
    );
  }

  if (code) {
    return (
      <code
        className={cn(
          classes,
          'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
          className,
        )}
        style={style}
      >
        {children}
      </code>
    );
  }

  if (mark) {
    return (
      <mark className={cn(classes, 'p-0 bg-yellow-200', className)} style={style}>
        {children}
      </mark>
    );
  }

  if (keyboard) {
    return (
      <kbd className={cn(classes, 'px-1 py-0.5 bg-gray-100 border border-gray-300 rounded', className)} style={style}>
        {children}
      </kbd>
    );
  }

  if (strong) {
    return (
      <strong className={cn(classes, 'font-semibold', className)} style={style}>
        {children}
      </strong>
    );
  }

  return (
    <span className={cn(classes, className)} style={style}>
      {children}
    </span>
  );
}

export default Text;
