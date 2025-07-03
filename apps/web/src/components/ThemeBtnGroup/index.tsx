import Link from 'next/link';
import type { UrlObject } from 'url';

import { cn } from '@nl/ui/lib/utils';
import AnimatedWrapper from '@nl/ui/custom/AnimatedWrapper';
import ExternalIcon from '@/components/ExternalIcon';

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
  >
    {title}
    {external && <ExternalIcon className="mt-0.5" />}
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
      'w-full flex flex-row flex-wrap justify-center z-10',
      'gap-2 md:gap-3 xl:gap-4',
      'mt-4 xl:mt-6',
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
