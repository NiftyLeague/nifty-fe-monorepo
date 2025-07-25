'use client';

import type { LucideProps } from 'lucide-react';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';

export type { IconName } from 'lucide-react/dynamic';
export type IconSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const DEFAULT_SIZES: Record<IconSizes, number> = { xs: 14, sm: 18, md: 20, lg: 24, xl: 28 };

const DEFAULT_COLORS: Record<string, string> = {
  foreground: 'var(--color-foreground)',
  dim: 'var(--color-foreground-2)',
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

export type IconColor = keyof typeof DEFAULT_COLORS;

export interface IconProps extends Omit<LucideProps, 'size'> {
  name: IconName;
  size?: IconSizes | number;
  color?: IconColor | (string & {});
  fill?: IconColor | (string & {});
}

export const Icon = ({
  absoluteStrokeWidth = true,
  color = 'currentColor',
  fill = 'none',
  name,
  size = 'md',
  strokeWidth = 1.5,
  ...props
}: IconProps) => {
  const iconColor = DEFAULT_COLORS[color] || color;
  const iconFill = DEFAULT_COLORS[fill] || fill;
  const iconSize = typeof size === 'number' ? size : DEFAULT_SIZES[size];
  const fallback = () => <div style={{ width: iconSize, height: iconSize }} />;

  return (
    <DynamicIcon
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
};

export default Icon;
