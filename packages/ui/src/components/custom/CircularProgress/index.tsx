import { Icon, type IconProps } from '@nl/ui/base/icon';
import { cn } from '@nl/ui/utils';

const CircularProgress = ({ className = '', size = 'xl', ...props }: Omit<IconProps, 'name'>) => (
  <Icon
    name="loader-circle"
    size={size}
    strokeWidth={2.5}
    className={cn('inline-block flex-shrink-0 animate-spin', className)}
    aria-hidden="true"
    {...props}
  />
);

export { CircularProgress };
