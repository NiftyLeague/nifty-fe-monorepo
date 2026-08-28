import { Title } from '@nl/ui/custom/typography'

interface SectionTitleProps {
  actions?: React.ReactNode
  firstSection?: boolean
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const variantToLevel = { h1: 1, h2: 2, h3: 3, h4: 4, h5: 5, h6: 6 } as const

const SectionTitle: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<SectionTitleProps>>
> = ({ children, firstSection, actions, variant = 'h2' }) => (
  <div
    className={`mb-2 flex flex-row flex-wrap items-center justify-between gap-4 ${
      firstSection ? 'mt-0' : 'mt-4'
    }`}
  >
    {typeof children === 'string' ? (
      <Title level={variantToLevel[variant]}>{children}</Title>
    ) : (
      children
    )}
    {actions}
  </div>
)

export default SectionTitle
