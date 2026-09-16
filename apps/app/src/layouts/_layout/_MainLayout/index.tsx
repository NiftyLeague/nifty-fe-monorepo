// third party
import dynamic from '@/runtime/dynamic'

// project imports
import AppShell from '@/layouts/_layout/AppShell'
import Header from './_Header'
import Sidebar from './_Sidebar'
import type { JSX } from 'solid-js'

const NetworkWarning = dynamic(() => import('./_Header/NetworkWarning'), { ssr: false })

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = ({
  children,
  walletReady = true,
}: { walletReady?: boolean } & { children?: JSX.Element }) => {
  return (
    <AppShell
      header={<Header />}
      sidebar={<Sidebar walletReady={walletReady} />}
      networkWarning={walletReady ? <NetworkWarning /> : undefined}
    >
      {children}
    </AppShell>
  )
}

export default MainLayout
