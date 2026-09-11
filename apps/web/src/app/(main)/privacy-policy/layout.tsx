import type { RouteMetadata } from '@/runtime/metadata'
import type { PropsWithChildren } from 'react'
import MainLayout from '@/components/MainLayout'

export const metadata: RouteMetadata = { title: 'Privacy Policy' }

export default function Layout({ children }: PropsWithChildren) {
  return <MainLayout classes={{ root: 'legal-pg' }}>{children}</MainLayout>
}
