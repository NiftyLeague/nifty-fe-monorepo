import type { PropsWithChildren } from 'react'

import PublicMainLayout from '@/app/_layout/_PublicMainLayout'

export default function PublicRoutesLayout({ children }: PropsWithChildren) {
  return <PublicMainLayout>{children}</PublicMainLayout>
}
