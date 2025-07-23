import React from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import type * as RadixPopoverTypes from '@radix-ui/react-popover';
import { Icon } from '@nl/ui/base/icon';

import DropdownStyles from './Popover.module.css';

interface RootProps {
  align?: RadixPopoverTypes.PopoverContentProps['align'];
  ariaLabel?: string;
  arrow?: boolean;
  children?: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
  modal?: boolean;
  onOpenChange?: RadixPopoverTypes.PopoverProps['onOpenChange'];
  open?: boolean;
  overlay?: React.ReactNode;
  portalled?: boolean;
  showClose?: boolean;
  side?: RadixPopoverTypes.PopoverContentProps['side'];
  sideOffset?: RadixPopoverTypes.PopoverContentProps['sideOffset'];
  style?: React.CSSProperties;
}

function Popover({
  align = 'center',
  ariaLabel,
  arrow = false,
  children,
  className,
  defaultOpen = false,
  modal,
  onOpenChange,
  open,
  overlay,
  portalled,
  showClose,
  side = 'bottom',
  sideOffset = 6,
  style,
}: RootProps) {
  const classes = [DropdownStyles['sbui-popover__content']];
  if (className) {
    classes.push(className);
  }

  return (
    <RadixPopover.Root defaultOpen={defaultOpen} modal={modal} onOpenChange={onOpenChange} open={open}>
      <RadixPopover.Trigger className={DropdownStyles['sbui-popover__trigger']} aria-label={ariaLabel}>
        {children}
      </RadixPopover.Trigger>

      <RadixPopover.Content
        sideOffset={sideOffset}
        side={side}
        align={align}
        className={classes.join(' ')}
        style={style}
        // @ts-expect-error - unknown prop
        portalled={portalled}
      >
        {arrow && (
          <RadixPopover.Arrow className={DropdownStyles['sbui-popover__arrow']} offset={10}></RadixPopover.Arrow>
        )}
        {overlay}
        {showClose && (
          <RadixPopover.Close className={DropdownStyles['sbui-popover__close']}>
            <Icon name="x" size="sm" />
          </RadixPopover.Close>
        )}
      </RadixPopover.Content>
    </RadixPopover.Root>
  );
}

export default Popover;
