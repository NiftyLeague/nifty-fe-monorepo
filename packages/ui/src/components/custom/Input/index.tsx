import { cloneElement, forwardRef, useCallback, useLayoutEffect, useRef, useState } from 'react';

import { cn } from '@nl/ui/utils';
import { Button } from '@nl/ui/base/button';
import { Icon, type IconProps } from '@nl/ui/base/icon';
import { Input as BaseInput } from '@nl/ui/base/input';

export interface InputProps extends React.ComponentProps<'input'> {
  actions?: React.ReactNode;
  copy?: boolean;
  error?: boolean;
  endIcon?: React.ReactElement<IconProps>;
  startIcon?: React.ReactElement<IconProps>;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ actions, className, copy, disabled, error, endIcon, startIcon, type, ...props }, ref) => {
    const [inputType, setInputType] = useState(type);
    const reveal = type === 'password' && props.value;
    const hidden = inputType === 'password';

    const [rightPadding, setRightPadding] = useState(0);
    const rightElementsRef = useRef<HTMLDivElement>(null);

    const [copyLabel, setCopyLabel] = useState('Copy');

    const onCopy = useCallback((value: string) => {
      navigator.clipboard.writeText(value).then(
        () => {
          setCopyLabel('Copied');
          setTimeout(() => {
            setCopyLabel('Copy');
          }, 3000);
        },
        () => {
          setCopyLabel('Failed to copy');
        },
      );
    }, []);

    if (props['aria-invalid'] || error) {
      endIcon = <Icon name="alert-circle" color="error" />;
    }

    // Calculate dynamic right padding
    useLayoutEffect(() => {
      if (rightElementsRef.current) {
        const containerWidth = rightElementsRef.current.offsetWidth;
        // Add default BaseInput padding pr-3 (12px)
        setRightPadding(containerWidth + 12);
      } else {
        setRightPadding(0);
      }
    }, [reveal, copy, actions, endIcon, copyLabel]);

    return (
      <div className="relative flex items-center">
        {startIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {cloneElement(startIcon, { size: 'sm', className: cn('text-muted-foreground', startIcon.props.className) })}
          </div>
        )}
        <BaseInput
          ref={ref}
          disabled={disabled}
          type={inputType}
          className={cn(startIcon && 'pl-10', className)}
          style={{ paddingRight: rightPadding > 0 ? `${rightPadding}px` : undefined }}
          {...props}
        />
        {(reveal || copy || actions || endIcon) && (
          <div ref={rightElementsRef} className="absolute inset-y-0 right-0 flex items-center gap-1 pr-0.5">
            {reveal && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={disabled}
                onClick={() => setInputType(hidden ? 'text' : 'password')}
                className="px-2 cursor-pointer"
              >
                {hidden ? 'Reveal' : 'Hide'}
              </Button>
            )}
            {copy && props.value && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onCopy(props.value as string)}
                className="px-2 cursor-pointer"
                aria-live="polite"
              >
                <Icon name="copy" size="sm" />
                {copyLabel}
              </Button>
            )}
            {actions}
            {endIcon && (
              <div className="pointer-events-none pl-1 pr-2.5">
                {cloneElement(endIcon, { size: 'sm', className: cn('text-muted-foreground', endIcon.props.className) })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
