'use client';

import { cn } from '@nl/ui/utils';
import { Button } from '@nl/ui/base/button';
import { Icon } from '@nl/ui/base/icon';

import * as SocialIcons from './social-icons';
import buttonStyles from './socials.module.css';

interface ButtonProps {
  disabled?: boolean;
  label?: string;
  loading?: boolean;
  onClick?: () => void;
  provider: keyof typeof SocialIcons;
  withColor?: boolean;
}

export function SocialIconButton({
  disabled = false,
  label = '',
  loading = false,
  onClick,
  provider,
  withColor = false,
}: ButtonProps) {
  const AuthIcon = SocialIcons[provider];

  return (
    <Button
      key={provider}
      variant="outline"
      type="button"
      className={cn('w-full cursor-pointer disabled:cursor-not-allowed', withColor && buttonStyles[provider])}
      disabled={disabled}
      onClick={onClick}
    >
      {loading ? <Icon name="loader" className="animate-spin" /> : <AuthIcon />}
      {label && label}
      <span className="sr-only">{provider}</span>
    </Button>
  );
}

export default SocialIconButton;
