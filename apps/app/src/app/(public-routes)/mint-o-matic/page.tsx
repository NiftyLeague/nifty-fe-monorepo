'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { Button } from '@nl/ui/base/button'
import { Title } from '@nl/ui/custom/typography'

import { ErrorBoundary } from '@nl/ui/custom/error-boundry'
import { Preloader } from '@nl/ui/custom/preloader'
import useAuth from '@/hooks/useAuth'
import { DEGEN_COLLECTION_URL } from '@/constants/url'
import { useDegenOwnershipContext } from '@/contexts/DegenOwnershipContext'

const CharacterCreator = dynamic(() => import('./_CharacterCreator'), { ssr: false })

const MintPage = () => {
  const [isLoaded, setLoaded] = useState(false)
  const [progress, setProgress] = useState(0)
  const { isDegenOwner } = useDegenOwnershipContext()
  const { isConnected, isLoggedIn, handleConnectWallet } = useAuth()

  const searchParams = useSearchParams()
  const { nifty_artists: isForNiftyArtists } = Object.fromEntries(searchParams.entries())

  if (!isForNiftyArtists) {
    if (!isLoggedIn) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Title level={3} className="text-center">
            Please connect your wallet
          </Title>
          <Button className="mt-4" onClick={handleConnectWallet}>
            {isConnected ? 'Log In' : 'Connect Wallet'}
          </Button>
        </div>
      )
    }

    if (!isDegenOwner) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Title level={3} className="text-center">
            This page is accessible to DEGEN owners only.
          </Title>
          <Button asChild className="mt-4">
            <Link href={DEGEN_COLLECTION_URL} target="_blank" rel="noreferrer">
              Buy A DEGEN
            </Link>
          </Button>
        </div>
      )
    }
  }

  return (
    <div style={{ textAlign: 'center', overflowX: 'hidden' }}>
      <ErrorBoundary>
        <Preloader ready={isLoaded} progress={progress} />
        <CharacterCreator setLoaded={setLoaded} setProgress={setProgress} />
      </ErrorBoundary>
    </div>
  )
}

export default MintPage
