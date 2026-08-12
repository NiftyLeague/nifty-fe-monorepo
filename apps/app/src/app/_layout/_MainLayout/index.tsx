'use client'

// third party
import { type PropsWithChildren } from 'react'
import dynamic from 'next/dynamic'

// project imports
import AppShell from '@/app/_layout/AppShell'
import Header from './_Header'
import Sidebar from './_Sidebar'

const NetworkWarning = dynamic(() => import('./_Header/NetworkWarning'), { ssr: false })

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <AppShell header={<Header />} sidebar={<Sidebar />} networkWarning={<NetworkWarning />}>
      {children}
    </AppShell>
  )
}

export default MainLayout
