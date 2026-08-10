import type { PropsWithChildren } from 'react'

import PublicAppContextWrapper from '@/contexts/PublicAppContextWrapper'
import PublicMainLayout from '@/app/_layout/_PublicMainLayout'

export default function PublicRoutesLayout({ children }: PropsWithChildren) {
  return (
    <PublicAppContextWrapper>
      <PublicMainLayout>{children}</PublicMainLayout>
    </PublicAppContextWrapper>
  )
}
