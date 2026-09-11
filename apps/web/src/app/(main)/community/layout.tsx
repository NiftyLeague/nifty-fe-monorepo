import type { RouteMetadata } from '@/runtime/metadata'
import type { PropsWithChildren } from 'react'
import MainLayout from '@/components/MainLayout'

export const metadata: RouteMetadata = {
  title: 'Community',
  description: 'Community comes first at Nifty League',
  openGraph: {
    title: 'Nifty League | Community',
    description: 'Community comes first at Nifty League',
    images: 'https://niftyleague.com/img/backgrounds/banner-dark.webp',
  },
}

export default function Layout({ children }: PropsWithChildren) {
  return <MainLayout classes={{ root: 'com-pg' }}>{children}</MainLayout>
}
