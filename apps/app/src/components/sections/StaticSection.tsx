import type { PropsWithChildren, ReactNode } from 'react'

import type { SxProps, Theme } from '@/types'
import SectionTitle from './SectionTitle'

const sectionSpacing = 2 // 16px

interface StaticSectionProps {
  title: string | ReactNode
  firstSection?: boolean
  actions?: ReactNode
  children?: ReactNode
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  styles?: { root?: SxProps<Theme>; headerRow?: SxProps<Theme>; mainRow?: SxProps<Theme> }
}

const StaticSection = ({
  title,
  firstSection,
  children,
  actions,
  variant = 'h2',
  styles,
}: PropsWithChildren<StaticSectionProps>) => (
  <div
    className="flex flex-col"
    style={{ gap: sectionSpacing * 8, ...(styles?.root as React.CSSProperties) }}
  >
    <div style={styles?.headerRow as React.CSSProperties}>
      <SectionTitle firstSection={firstSection} variant={variant} actions={actions}>
        {title}
      </SectionTitle>
    </div>
    <div style={styles?.mainRow as React.CSSProperties}>{children}</div>
  </div>
)

export default StaticSection
