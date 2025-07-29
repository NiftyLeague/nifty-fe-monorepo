'use client';

import { forwardRef } from 'react';
import type { LucideProps } from 'lucide-react';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';

type IconSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const DEFAULT_SIZES: Record<IconSizes, number> = { xs: 14, sm: 18, md: 20, lg: 24, xl: 28 };

const DEFAULT_COLORS: Record<string, string> = {
  foreground: 'var(--color-foreground)',
  dim: 'var(--color-muted-foreground)',
  dark: 'var(--color-dark)',
  light: 'var(--color-light)',

  error: 'var(--color-error)',
  warning: 'var(--color-warning)',
  success: 'var(--color-success)',
  info: 'var(--color-info)',

  blue: 'var(--color-blue)',
  purple: 'var(--color-purple)',
  gray: 'var(--color-base-500)',
};

type IconColor = keyof typeof DEFAULT_COLORS;

interface IconProps extends Omit<LucideProps, 'size'> {
  name: IconName;
  size?: IconSizes | number;
  color?: IconColor | (string & {});
  fill?: IconColor | (string & {});
}

const Icon = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      absoluteStrokeWidth = true,
      color = 'currentColor',
      fill = 'none',
      name,
      size = 'md',
      strokeWidth = 1.5,
      ...props
    },
    ref,
  ) => {
    const iconColor = DEFAULT_COLORS[color] || color;
    const iconFill = DEFAULT_COLORS[fill] || fill;
    const iconSize = typeof size === 'number' ? size : DEFAULT_SIZES[size];
    const fallback = () => <div style={{ width: iconSize, height: iconSize }} />;

    return (
      <DynamicIcon
        ref={ref}
        absoluteStrokeWidth={absoluteStrokeWidth}
        color={iconColor}
        fallback={fallback}
        fill={iconFill}
        name={name}
        size={iconSize}
        strokeWidth={strokeWidth}
        {...props}
      />
    );
  },
);

Icon.displayName = 'Icon';

export { Icon };
export type { IconColor, IconName, IconProps, IconSizes };
