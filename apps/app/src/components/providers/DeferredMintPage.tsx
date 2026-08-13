'use client'

import DeferredComponent from '@nl/ui/custom/deferred-component'

const loadMintPageContent = () => import('./MintPageContent')

export default function DeferredMintPage() {
  return <DeferredComponent label="Mint page" load={loadMintPageContent} props={{}} />
}
