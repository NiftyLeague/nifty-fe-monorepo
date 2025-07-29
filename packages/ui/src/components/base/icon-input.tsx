import * as React from 'react';

import { cn } from '@nl/ui/utils';
import { type IconProps } from './icon';
import { Input } from './input';

export interface IconInputProps extends React.ComponentProps<'input'> {
  startIcon?: React.ReactElement<IconProps>;
  endIcon?: React.ReactElement<IconProps>;
}

const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(
  ({ className, type, startIcon, endIcon, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {startIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {React.cloneElement(startIcon, {
              size: 18,
              className: cn('text-muted-foreground', startIcon.props.className),
            })}
          </div>
        )}
        <Input
          type={type}
          className={cn(startIcon ? 'pl-10' : '', endIcon ? 'pr-10' : '', className)}
          ref={ref}
          {...props}
        />
        {endIcon && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            {React.cloneElement(endIcon, { size: 18, className: cn('text-muted-foreground', endIcon.props.className) })}
          </div>
        )}
      </div>
    );
  },
);
IconInput.displayName = 'IconInput';

export { IconInput };
