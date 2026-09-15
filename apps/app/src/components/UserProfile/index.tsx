'use client'

import Link from '@/runtime/Link'
import { createMemo } from 'solid-js'
import { UserRound } from 'lucide-solid'
import { useAccount, useEnsAvatar, useEnsName } from '@/runtime/wagmi'
import { normalize } from 'viem/ens'

import { Avatar, AvatarFallback, AvatarImage } from '@nl/ui/base/avatar'
import { buttonVariants } from '@nl/ui/base/button-variants'

import ConnectWrapper from '@/components/wrapper/ConnectWrapper'
import useGamerProfile from '@/hooks/useGamerProfile/useGamerProfile'
import useAuth from '@/hooks/useAuth'

const UserProfile = () => {
  const auth = useAuth()
  const account = useAccount()
  const ensName = useEnsName(() => ({
    address: account.address as `0x${string}`,
    chainId: 1,
    query: { enabled: account.isConnected && !!account.address },
  }))
  const ensAvatar = useEnsAvatar(() => ({
    name: ensName.data ? normalize(ensName.data as string) : undefined,
    chainId: 1,
    query: { enabled: account.isConnected && !!ensName.data },
  }))
  const { profile } = useGamerProfile()

  const username = () => (auth.isLoggedIn && profile ? profile.name_cased : undefined)
  const avatar = () => (auth.isLoggedIn && profile ? profile.avatar : undefined)

  const displayName = createMemo(() => {
    const address = account.address
    if (!address) return 'Login to view dashboards'
    const addressSubstring = `${address.slice(0, 5)}..${address.slice(-4)}`.toLowerCase()
    const name = username()
    if (name?.length && name !== addressSubstring) return name
    if (ensName.isError || ensName.isLoading) return addressSubstring
    return ensName.data || addressSubstring
  })

  return (
    <div
      class="flex flex-col items-center rounded-lg p-4"
      style={{ background: 'var(--color-muted)', border: 'var(--border-default)' }}
    >
      <Avatar class="size-20">
        <AvatarImage alt="avatar" src={ensAvatar.data || avatar()?.url} />
        <AvatarFallback>
          <UserRound aria-hidden="true" class="size-10 text-muted-foreground" stroke-width={1.5} />
        </AvatarFallback>
      </Avatar>
      <div class="my-2 flex flex-col items-center">
        <span style={{ 'white-space': 'nowrap' }}>{displayName()}</span>
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
