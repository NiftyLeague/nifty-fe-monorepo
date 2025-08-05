import Link from 'next/link';
import type { UrlObject } from 'url';

import { cn } from '@nl/ui/utils';
import { AnimatedWrapper } from '@nl/ui/custom/animated-wrapper';
import { ExternalIcon } from '@nl/ui/custom/external-icon';

interface ButtonProps {
  href?: string | UrlObject;
  title: string;
  className?: string;
  disabled?: boolean;
  external?: boolean;
}

export const ThemeBtn = ({
  href,
  title,
  className = '',
  disabled = false,
  external = false,
  isPrimary = false,
}: ButtonProps & { isPrimary?: boolean }) => (
  <Link
    href={href || ''}
    target={external ? '_blank' : undefined}
    rel={external ? 'noreferrer' : undefined}
    aria-disabled={disabled}
    className={cn(
      isPrimary ? 'theme-btn-primary' : 'theme-btn-transparent',
      'transition-fade transition-fade-start delay-long',
      disabled && 'disabled',
      className,
    )}
    suppressHydrationWarning
  >
    {title}
    {external && <ExternalIcon />}
  </Link>
);

interface ThemeBtnGroupProps {
  className?: string;
  primary: ButtonProps;
  secondary?: ButtonProps;
}

export const ThemeBtnGroup = ({ className, primary, secondary }: ThemeBtnGroupProps) => (
  <div
    className={cn(
      'w-full flex flex-row flex-wrap justify-center items-center z-10',
      'gap-2 md:gap-3 xl:gap-4',
      'mt-4 xl:mt-6 -mx-2 sm:mx-0',
      className,
    )}
  >
    <AnimatedWrapper>
      <ThemeBtn {...primary} isPrimary />
    </AnimatedWrapper>
    {secondary ? (
      <AnimatedWrapper>
        <ThemeBtn {...secondary} />
      </AnimatedWrapper>
    ) : null}
  </div>
);

export default ThemeBtnGroup;
