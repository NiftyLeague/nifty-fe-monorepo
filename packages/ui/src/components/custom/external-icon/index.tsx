import { splitProps, type ComponentProps } from 'solid-js'

import { cx } from '@nl/ui/class-names'

export function ExternalIcon(props: ComponentProps<'svg'> & { className?: string }) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <svg
      {...others}
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={cx('ml-1 mb-1.5 inline-block shrink-0 cursor-pointer', local.class, local.className)}
      aria-hidden="true"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  )
}

export default ExternalIcon
