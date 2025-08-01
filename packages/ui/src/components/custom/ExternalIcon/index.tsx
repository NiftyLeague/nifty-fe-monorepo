import { Icon, type IconProps } from '@nl/ui/base/icon';
import { cn } from '@nl/ui/utils';

const ExternalIcon = ({ className = '', size = 'xs', ...props }: Omit<IconProps, 'name'>) => (
  <Icon
    name="external-link"
    size={size}
    className={cn('inline-block flex-shrink-0 cursor-pointer ml-1 mb-1.5', className)}
    aria-hidden="true"
    {...props}
  />
);

export default ExternalIcon;
