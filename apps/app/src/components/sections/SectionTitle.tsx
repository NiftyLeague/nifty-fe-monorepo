import { Title } from '@nl/ui/custom/typography'
import type { JSX } from 'solid-js'

interface SectionTitleProps {
  actions?: JSX.Element
  firstSection?: boolean
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const variantToLevel = { h1: 1, h2: 2, h3: 3, h4: 4, h5: 5, h6: 6 } as const

const SectionTitle = (props: SectionTitleProps & { children?: JSX.Element }) => {
  return (
    <div
      class={`mb-2 flex flex-row flex-wrap items-center justify-between gap-4 ${
        props.firstSection ? 'mt-0' : 'mt-4'
      }`}
    >
      {typeof props.children === 'string' ? (
        <Title level={variantToLevel[props.variant ?? 'h2']}>{props.children}</Title>
      ) : (
        props.children
      )}
      {props.actions}
    </div>
  )
}

export default SectionTitle
