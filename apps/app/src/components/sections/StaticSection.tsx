import type { JSX, ParentProps } from 'solid-js'

import type { SxProps } from '@/types'
import SectionTitle from './SectionTitle'

const sectionSpacing = 2 // 16px

interface StaticSectionProps {
  title: string | JSX.Element
  firstSection?: boolean
  actions?: JSX.Element
  children?: JSX.Element
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  styles?: { root?: SxProps; headerRow?: SxProps; mainRow?: SxProps }
}

const StaticSection = (props: ParentProps<StaticSectionProps>) => (
  <div
    class="flex flex-col"
    style={{ gap: `${sectionSpacing * 8}px`, ...(props.styles?.root as JSX.CSSProperties) }}
  >
    <div style={props.styles?.headerRow as JSX.CSSProperties}>
      <SectionTitle
        firstSection={props.firstSection}
        variant={props.variant ?? 'h2'}
        actions={props.actions}
      >
        {props.title}
      </SectionTitle>
    </div>
    <div style={props.styles?.mainRow as JSX.CSSProperties}>{props.children}</div>
  </div>
)

export default StaticSection
