import Link from 'next/link'
import type { UrlObject } from 'url'

import { cn } from '@nl/ui/utils'
import { ExternalIcon } from '@nl/ui/custom/external-icon'

interface ButtonProps {
  href?: string | UrlObject
  title: string
  responsiveTitle?: { mobile: string; desktop: string }
  className?: string
  disabled?: boolean
  external?: boolean
}

export const ThemeBtn = ({
  href,
  title,
  responsiveTitle,
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
      disabled && 'disabled',
      className
    )}
    suppressHydrationWarning
  >
    {responsiveTitle ? (
      <>
        <span className="responsive-label-mobile">{responsiveTitle.mobile}</span>
        <span className="responsive-label-desktop">{responsiveTitle.desktop}</span>
      </>
    ) : (
      title
    )}
    {external && <ExternalIcon />}
  </Link>
)

interface ThemeBtnGroupProps {
  className?: string
  primary: ButtonProps
  secondary?: ButtonProps
}

export const ThemeBtnGroup = ({ className, primary, secondary }: ThemeBtnGroupProps) => (
  <div
    className={cn(
      'w-full flex flex-row flex-wrap justify-center items-center z-10',
      'gap-2 md:gap-3 xl:gap-4',
      'mt-4 xl:mt-6 -mx-2 sm:mx-0',
      className
    )}
  >
    <ThemeBtn {...primary} isPrimary />
    {secondary ? <ThemeBtn {...secondary} /> : null}
  </div>
)

export default ThemeBtnGroup
