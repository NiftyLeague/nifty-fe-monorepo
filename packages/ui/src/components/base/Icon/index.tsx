import type { LucideProps } from 'lucide-react';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';

export type IconSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const DEFAULT_SIZES: Record<IconSizes, number> = { xs: 14, sm: 18, md: 20, lg: 24, xl: 28 };

const DEFAULT_COLORS: Record<string, string> = {
  foreground: 'var(--color-foreground)',
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
}

export const Icon = ({
  absoluteStrokeWidth = true,
  color = 'currentColor',
  name,
  size = 'md',
  strokeWidth = 2,
  ...props
}: IconProps) => {
  const iconSize = typeof size === 'number' ? size : DEFAULT_SIZES[size];
  const iconColor = DEFAULT_COLORS[color] || color;

  return (
    <DynamicIcon
      absoluteStrokeWidth={absoluteStrokeWidth}
      color={iconColor}
      fallback={() => <div style={{ width: iconSize, height: iconSize }} />}
      name={name}
      size={iconSize}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
};

export default Icon;
