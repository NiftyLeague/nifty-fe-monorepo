import type { PropsWithChildren } from 'react'

import PublicNavigation from '@/components/providers/PublicNavigation'

export default function PublicMainLayout({ children }: PropsWithChildren) {
  return <PublicNavigation>{children}</PublicNavigation>
}
