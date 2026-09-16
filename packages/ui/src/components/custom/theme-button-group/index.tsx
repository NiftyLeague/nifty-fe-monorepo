import type { JSX } from 'solid-js'
import { buttonVariants } from '@nl/ui/base/button-variants'
import { ExternalIcon } from '@nl/ui/custom/external-icon'
import { cx } from '@nl/ui/class-names'

export interface ThemeButtonProps {
  href?: string
  title: JSX.Element
  responsiveTitle?: { mobile: string; desktop: string }
  className?: string
  disabled?: boolean
  external?: boolean
}

export function ThemeButton(props: ThemeButtonProps & { isPrimary?: boolean }) {
  const buttonClassName = cx(
    props.isPrimary ? 'theme-btn-primary' : 'theme-btn-transparent',
    // The shared button recipe supplies a compact default size. Keep the
    // marketing button scale from theme-btn across responsive breakpoints.
    // These stay in px: the root font is fluid (up to 1.125rem), so rem-based
    // heights would render 78.75px instead of the contracted 70px on desktop
    // (pinned by apps/web/e2e/regression.e2e.ts).
    '!h-[40px] md:!h-[50px] lg:!h-[60px] xl:!h-[70px] 2xl:!h-[80px]',
    props.className ?? ''
  )
  const content = () =>
    props.responsiveTitle ? (
      <>
        <span class="responsive-label-mobile">{props.responsiveTitle!.mobile}</span>
        <span class="responsive-label-desktop">{props.responsiveTitle!.desktop}</span>
      </>
    ) : (
      props.title
    )

  if (props.disabled) {
    return (
      <button
        type="button"
        disabled
        class={buttonVariants({ className: cx(buttonClassName, 'disabled') })}
      >
        {content()}
        {props.external && <ExternalIcon />}
      </button>
    )
  }

  if (!props.href) return null

  const resolvedClassName = buttonVariants({ variant: 'ghost', className: buttonClassName })

  return (
    <a
      href={props.href}
      target={props.external ? '_blank' : undefined}
      rel={props.external ? 'noreferrer' : undefined}
      class={resolvedClassName}
    >
      {content()}
      {props.external && <ExternalIcon />}
      {/* The icon is decorative, so the new-tab behaviour needs its own text. */}
      {props.external && <span class="sr-only">(opens in a new tab)</span>}
    </a>
  )
}

interface ThemeButtonGroupProps {
  class?: string
  className?: string
  primary: ThemeButtonProps
  secondary?: ThemeButtonProps
}

export function ThemeButtonGroup(props: ThemeButtonGroupProps) {
  return (
    <div
      class={cx(
        'w-full flex flex-row flex-wrap justify-center items-center z-10',
        'gap-2 md:gap-3 xl:gap-4',
        'mt-4 xl:mt-6 -mx-2 sm:mx-0',
        props.class ?? props.className
      )}
    >
      <ThemeButton {...props.primary} isPrimary />
      {props.secondary ? <ThemeButton {...props.secondary} /> : null}
    </div>
  )
}

export default ThemeButtonGroup
