import type { RouteMetadata } from '@/runtime/metadata'
import type { PropsWithChildren } from 'react'
import MainLayout from '@/components/MainLayout'

export const metadata: RouteMetadata = {
  title: 'Compete & Earn',
  description: 'Adrenaline fueled, fast-paced brawl mode where the winner takes ALL',
  openGraph: {
    title: 'Nifty League | Compete & Earn',
    description: 'Adrenaline fueled, fast-paced brawl mode where the winner takes ALL',
    images: 'https://niftyleague.com/img/compete-and-earn/splash.webp',
  },
}

export default function Layout({ children }: PropsWithChildren) {
  return <MainLayout classes={{ root: 'compete-pg' }}>{children}</MainLayout>
}
