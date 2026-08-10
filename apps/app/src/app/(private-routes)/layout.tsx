import type { PropsWithChildren } from 'react'

import AppContextWrapper from '@/contexts/AppContextWrapper'
import MainLayout from '@/app/_layout/_MainLayout'

export default function PrivateRoutesLayout({ children }: PropsWithChildren) {
  return (
    <AppContextWrapper>
      <MainLayout>{children}</MainLayout>
    </AppContextWrapper>
  )
}
