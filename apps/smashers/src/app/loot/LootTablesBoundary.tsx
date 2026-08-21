'use client'

import dynamic from 'next/dynamic'

import RouteLoading from '@nl/ui/custom/route-loading'

const LootTables = dynamic(() => import('./LootTables'), {
  ssr: false,
  loading: () => <RouteLoading label="Loading loot tables" />,
})

export default function LootTablesBoundary() {
  return <LootTables />
}
