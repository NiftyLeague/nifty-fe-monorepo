'use client'

import type { PropsWithChildren } from 'react'

import AppShell from '@/app/_layout/AppShell'
import Header from '@/app/_layout/_MainLayout/_Header'
import PublicSidebar from '@/app/_layout/_MainLayout/_Sidebar/PublicSidebar'

export default function PublicMainLayout({ children }: PropsWithChildren) {
  return (
    <AppShell header={<Header />} sidebar={<PublicSidebar />}>
      {children}
    </AppShell>
  )
}
