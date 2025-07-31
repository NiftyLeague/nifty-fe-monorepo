import { cn } from '@nl/ui/utils';

interface LinkProps {
  className?: string;
  disabled?: boolean;
  href: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  style?: React.CSSProperties;
  target?: '_blank' | '_self' | '_parent' | '_top' | 'framename';
}

function Link({ children, className, disabled, href, onClick, style, target }: React.PropsWithChildren<LinkProps>) {
  const classes = cn(
    'cursor-pointer text-base text-blue no-underline hover:underline',
    { 'text-muted-foreground cursor-not-allowed': disabled },
    className,
  );

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <a
      onClick={handleClick}
      className={classes}
      href={!disabled ? href : undefined}
      target={target}
      rel="noopener noreferrer"
      style={style}
    >
      {children}
    </a>
  );
}

export default Link;
