'use client'

import type { PropsWithChildren } from 'react'
import { usePathname } from 'next/navigation'

export default function PublicMainContent({ children }: PropsWithChildren) {
  const pathname = usePathname()
  const isNoFilterPage = pathname ? /(degens|dashboard\/degens)/.test(pathname) : false

  return isNoFilterPage ? children : <div className="container py-5 md:py-10">{children}</div>
}
