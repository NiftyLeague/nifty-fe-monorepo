import type { RouteMetadata } from '@/runtime/metadata'
import type { PropsWithChildren } from 'react'
import MainLayout from '@/components/MainLayout'

export const metadata: RouteMetadata = {
  title: 'NiftyWorld',
  description: 'A virtual space for gamers to connect, collaborate, and compete with each other',
  openGraph: {
    title: 'Nifty League | NiftyWorld',
    description: 'A virtual space for gamers to connect, collaborate, and compete with each other',
    images: 'https://niftyleague.com/img/niftyworld/beachfront_night.webp',
  },
}

export default function Layout({ children }: PropsWithChildren) {
  return <MainLayout classes={{ root: 'niftyworld-pg' }}>{children}</MainLayout>
}
