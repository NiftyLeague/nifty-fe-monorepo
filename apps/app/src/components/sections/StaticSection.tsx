import type { JSX, ParentProps } from 'solid-js'

import SectionTitle from './SectionTitle'

interface StaticSectionProps {
  title: string | JSX.Element
  firstSection?: boolean
  actions?: JSX.Element
  children?: JSX.Element
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  class?: string
  mainRowClass?: string
}

const StaticSection = (props: ParentProps<StaticSectionProps>) => (
  <div class={`flex flex-col gap-4 ${props.class ?? ''}`}>
    <div>
      <SectionTitle
        firstSection={props.firstSection}
        variant={props.variant ?? 'h2'}
        actions={props.actions}
      >
        {props.title}
      </SectionTitle>
    </div>
    <div class={props.mainRowClass ?? ''}>{props.children}</div>
  </div>
)

export default StaticSection
