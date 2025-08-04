'use client';

import { Icon, type IconProps } from '@nl/ui/base/icon';
import { cn } from '@nl/ui/utils';

export function CircularProgress({ className = '', size = 'xl', ...props }: Omit<IconProps, 'name'>) {
  return (
    <Icon
      name="loader-circle"
      size={size}
      strokeWidth={2.5}
      className={cn('inline-block flex-shrink-0 animate-spin', className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export default CircularProgress;
