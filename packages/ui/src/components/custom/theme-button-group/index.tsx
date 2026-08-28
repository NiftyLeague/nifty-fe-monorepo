import { buttonVariants } from '@nl/ui/base/button-variants'
import { ExternalIcon } from '@nl/ui/custom/external-icon'
import { cx } from '@nl/ui/class-names'

export interface ThemeButtonProps {
  href?: string
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
  const buttonClassName = cx(isPrimary ? 'theme-btn-primary' : 'theme-btn-transparent', className)
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
      <button
        type="button"
        disabled
        className={buttonVariants({ className: cx(buttonClassName, 'disabled') })}
      >
        {content}
        {external && <ExternalIcon />}
      </button>
    )
  }

  if (!href) return null

  const resolvedClassName = buttonVariants({ variant: 'ghost', className: buttonClassName })

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={resolvedClassName}
    >
      {content}
      {external && <ExternalIcon />}
    </a>
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
      className={cx(
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
