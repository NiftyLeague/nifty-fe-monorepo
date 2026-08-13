import Link from 'next/link'
import type { UrlObject } from 'url'

import { Button } from '@nl/ui/base/button'
import { ExternalIcon } from '@nl/ui/custom/external-icon'
import { cn } from '@nl/ui/utils'

export interface ThemeButtonProps {
  href?: string | UrlObject
  title: string
  responsiveTitle?: { mobile: string; desktop: string }
  className?: string
  disabled?: boolean
  external?: boolean
}

export function ThemeButton({
  href,
  title,
  responsiveTitle,
  className = '',
  disabled = false,
  external = false,
  isPrimary = false,
}: ThemeButtonProps & { isPrimary?: boolean }) {
  const buttonClassName = cn(isPrimary ? 'theme-btn-primary' : 'theme-btn-transparent', className)
  const content = responsiveTitle ? (
    <>
      <span className="responsive-label-mobile">{responsiveTitle.mobile}</span>
      <span className="responsive-label-desktop">{responsiveTitle.desktop}</span>
    </>
  ) : (
    title
  )

  if (disabled) {
    return (
      <Button type="button" disabled className={cn(buttonClassName, 'disabled')}>
        {content}
        {external && <ExternalIcon />}
      </Button>
    )
  }

  if (!href) return null

  return (
    <Button asChild variant="ghost" className={buttonClassName}>
      <Link
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
      >
        {content}
        {external && <ExternalIcon />}
      </Link>
    </Button>
  )
}

interface ThemeButtonGroupProps {
  className?: string
  primary: ThemeButtonProps
  secondary?: ThemeButtonProps
}

export function ThemeButtonGroup({ className, primary, secondary }: ThemeButtonGroupProps) {
  return (
    <div
      className={cn(
        'w-full flex flex-row flex-wrap justify-center items-center z-10',
        'gap-2 md:gap-3 xl:gap-4',
        'mt-4 xl:mt-6 -mx-2 sm:mx-0',
        className
      )}
    >
      <ThemeButton {...primary} isPrimary />
      {secondary ? <ThemeButton {...secondary} /> : null}
    </div>
  )
}

export default ThemeButtonGroup
