'use client'

import Link from '@/runtime/Link'
import { createMemo } from 'solid-js'
import { UserRound } from 'lucide-react'
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi'
import { normalize } from 'viem/ens'

import { Avatar, AvatarFallback, AvatarImage } from '@nl/ui/base/avatar'
import { buttonVariants } from '@nl/ui/base/button-variants'

import ConnectWrapper from '@/components/wrapper/ConnectWrapper'
import useGamerProfile from '@/hooks/useGamerProfile/useGamerProfile'
import useAuth from '@/hooks/useAuth'

const UserProfile = () => {
  const { isLoggedIn, isConnected } = useAuth()
  const { address } = useAccount()
  const ensName = useEnsName({ address, chainId: 1, query: { enabled: isConnected && !!address } })
  const ensAvatar = useEnsAvatar({
    name: ensName.data ? normalize(ensName.data) : undefined,
    chainId: 1,
    query: { enabled: isConnected && !!ensName.data },
  })
  const { profile } = useGamerProfile()

  const username = isLoggedIn && profile ? profile.name_cased : undefined
  const avatar = isLoggedIn && profile ? profile.avatar : undefined

  const displayName = createMemo(() => {
    if (!address) return 'Login to view dashboards'
    const addressSubstring = `${address.slice(0, 5)}..${address.slice(-4)}`.toLowerCase()
    if (username?.length && username !== addressSubstring) return username
    if (ensName.isError || ensName.isLoading) return addressSubstring
    return ensName.data || addressSubstring
  }, [address, ensName.data, ensName.isError, ensName.isLoading, username])

  return (
    <div
      class="flex flex-col items-center rounded-lg p-4"
      style={{ background: 'var(--color-muted)', border: 'var(--border-default)' }}
    >
      <Avatar class="size-20">
        <AvatarImage alt="avatar" src={ensAvatar.data || avatar?.url} />
        <AvatarFallback>
          <UserRound
            aria-hidden="true"
            class="size-10 text-muted-foreground"
            stroke-width={1.5}
          />
        </AvatarFallback>
      </Avatar>
      <div class="my-2 flex flex-col items-center">
        <span style={{ 'white-space': 'nowrap' }}>{displayName}</span>
      </div>
      <ConnectWrapper fullWidth>
        <Link
          href="/dashboard"
          prefetch={false}
          data-slot="button"
          class={buttonVariants({ className: 'w-full' })}
        >
          Open dashboard
        </Link>
      </ConnectWrapper>
    </div>
  )
}

export default UserProfile
