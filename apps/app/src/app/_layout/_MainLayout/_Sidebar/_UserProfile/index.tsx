'use client'

import { useMemo } from 'react'
import { useEnsAvatar, useEnsName } from 'wagmi'
import { normalize } from 'viem/ens'

import { Avatar, AvatarImage, AvatarFallback } from '@nl/ui/base/avatar'
import { Button } from '@nl/ui/base/button'
import { Skeleton } from '@nl/ui/base/skeleton'
import { formatNumberToDisplay } from '@nl/ui/utils'

import { useGamerProfile } from '@/hooks/useGamerProfile'
import type { ProfileAvatar } from '@/types/account'
import ConnectWrapper from '@/components/wrapper/ConnectWrapper'
import useNetworkContext from '@/hooks/useNetworkContext'
import useClaimNFTL from '@/hooks/writeContracts/useClaimNFTL'
import useAuth from '@/hooks/useAuth'

const ClaimNFTLView = () => {
  const { isConnected } = useNetworkContext()
  const { balance, claimCallback, loading } = useClaimNFTL()

  return (
    <>
      <div className="my-2 flex flex-col items-center">
        {loading ? (
          <Skeleton className="h-4 w-20" />
        ) : (
          <span className="font-bold">
            {balance ? formatNumberToDisplay(balance) : '0.00'} NFTL
          </span>
        )}
        <span>Available to Claim</span>
      </div>
      <Button
        variant="default"
        className="w-full cursor-pointer"
        disabled={!(balance > 0.0 && isConnected)}
        onClick={claimCallback}
      >
        Claim NFTL
      </Button>
    </>
  )
}

const UserProfile = () => {
  const { isLoggedIn, isConnected } = useAuth()
  const { address } = useNetworkContext()
  const ensName = useEnsName({ address, chainId: 1, query: { enabled: isConnected && !!address } })
  const ensAvatar = useEnsAvatar({
    name: normalize(ensName.data as string),
    chainId: 1,
    query: { enabled: isConnected && !!ensName.data },
  })
  const { profile } = useGamerProfile()

  const username = isLoggedIn && profile ? profile.name_cased : undefined
  const avatar = isLoggedIn && profile ? profile.avatar : undefined

  const displayName = useMemo(() => {
    if (!address) return 'Login to view dashboards'
    const addressSubstring = `${address?.slice(0, 5)}..${address?.slice(-4)}`.toLowerCase()
    if (username?.length && username !== addressSubstring) return username
    if (ensName.isError || ensName.isLoading) return addressSubstring
    return ensName.data || addressSubstring
  }, [address, ensName, username])

  return (
    <div
      className="flex flex-col items-center rounded-lg p-4"
      style={{ background: 'var(--color-muted)', border: 'var(--border-default)' }}
    >
      <Avatar className="size-20">
        <AvatarImage alt="avatar" src={ensAvatar.data || avatar?.url} />
        <AvatarFallback />
      </Avatar>
      <div className="my-2 flex flex-col items-center">
        <span style={{ whiteSpace: 'nowrap' }}>{displayName}</span>
      </div>
      <ConnectWrapper fullWidth>
        <ClaimNFTLView />
      </ConnectWrapper>
    </div>
  )
}

export default UserProfile
