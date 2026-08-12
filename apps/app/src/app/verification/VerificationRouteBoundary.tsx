'use client'

import dynamic from 'next/dynamic'

import RouteLoading from '@nl/ui/custom/route-loading'

const VerificationClient = dynamic(() => import('./VerificationClient'), {
  ssr: false,
  loading: () => <RouteLoading label="Loading wallet verification" />,
})

export default function VerificationRouteBoundary() {
  return <VerificationClient />
}
