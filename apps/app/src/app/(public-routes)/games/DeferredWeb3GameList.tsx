'use client'

import dynamic from 'next/dynamic'

const DeferredWeb3GameList = dynamic(() => import('./_Web3GameList/DeferredWeb3GameList'), {
  ssr: false,
  loading: () => <div className="col-span-12 min-h-24" aria-busy="true" />,
})

export default function Web3GameList() {
  return <DeferredWeb3GameList />
}
