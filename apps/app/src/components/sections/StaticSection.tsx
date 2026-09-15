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

const StaticSection = ({
  title,
  firstSection,
  children,
  actions,
  variant = 'h2',
  styles,
}: ParentProps<StaticSectionProps>) => (
  <div
    class="flex flex-col"
    style={{ gap: sectionSpacing * 8, ...(styles?.root as JSX.CSSProperties) }}
  >
    <div style={styles?.headerRow as JSX.CSSProperties}>
      <SectionTitle firstSection={firstSection} variant={variant} actions={actions}>
        {title}
      </SectionTitle>
    </div>
    <div style={styles?.mainRow as JSX.CSSProperties}>{props.children}</div>
  </div>
)

export default StaticSection
